#tool "nuget:?package=GitVersion.CommandLine&version=5.0.1"
#addin nuget:?package=Cake.Docker
#addin "Cake.FileHelpers"

GitVersion version;
var dockerDefaultRegistry = "localhost";

var target = Argument("target", "Default");
var artifactDir = Argument("artifactDir", "./../../../artifacts");
var dockerRegistry = Argument("dockerRegistry", dockerDefaultRegistry);
var dockerRegistryUsername = Argument<string>("dockerRegistryUsername");
var dockerRegistryPassword = Argument<string>("dockerRegistryPassword");

var versionFile = artifactDir + "/VERSION";
var publishDir = System.IO.Path.Combine(artifactDir, "publish");

Task("Clean").Does(() => {
    var settings = new DeleteDirectorySettings {
        Recursive = true,
        Force = true
    };

    var binDirs = GetDirectories("./../../**/bin");
    var objDirs = GetDirectories("./../../**/obj");

    CleanDirectories(binDirs);
    CleanDirectories(objDirs);

    DeleteDirectories(binDirs, settings);
    DeleteDirectories(objDirs, settings);

    if (DirectoryExists(artifactDir)) {
        CleanDirectory(artifactDir);
        DeleteDirectory(artifactDir, settings);  
    }

    DotNetCoreClean("./../../../");
});

Task("PrepareDirectories").Does(() => {
    EnsureDirectoryExists(artifactDir);
});

Task("Restore").Does(() => {
    DotNetCoreRestore("./../../../");
});

Task("Git-Version").Does(() => {
    version = GitVersion(new GitVersionSettings {
        OutputType = GitVersionOutput.Json,
        RepositoryPath = "./../../../"
    });

    Information("GitVersion = {");
    Information("   FullSemVer: {0}", version.FullSemVer);
    Information("   LegacySemVer: {0}", version.LegacySemVer);
    Information("   MajorMinorPatch: {0}", version.MajorMinorPatch);
    Information("   InformationalVersion: {0}", version.InformationalVersion);
    Information("   Nuget v2 version: {0}", version.NuGetVersionV2);
    Information("}");
    Information("Version to use: {0}", GetVersion());

    System.IO.File.WriteAllText(versionFile, GetVersion());
});

Task("Build").Does(() => {
    var settings = new DotNetCoreBuildSettings {
        Configuration = "Release",
        ArgumentCustomization = args => args.Append("/p:Version=" + GetVersion())
    };
    DotNetCoreBuild("./../../../", settings);
});

Task("Test").Does(() => {
    var settings = new DotNetCoreTestSettings {
        NoBuild = true,
        Configuration = "Release",
        Filter = "Category!=Integration"
    };

    foreach(var file in GetFiles("./../../../tests/**/*.csproj")) {
        DotNetCoreTest(file.FullPath, settings);
    }
});

Task("Publish").Does(() => {
    var settings = new DotNetCorePublishSettings {
        Configuration = "Release",
        OutputDirectory = publishDir,
        NoRestore = true,
        ArgumentCustomization = args => args.Append("/p:Version=" + GetVersion())
    };

    var projectFile = GetFiles("./../*.csproj").First();    
    DotNetCorePublish(projectFile.FullPath, settings);    
});

Task("Publish-Dockerfile").Does(() => {    
    CopyFiles(GetFiles("./../Dockerfile"), artifactDir);    
});

Task("Publish-Kubernetes-Config").Does(() => {    
    Information("Copy kubernetes folder");
    CopyDirectory("./../kubernetes", System.IO.Path.Combine(artifactDir, "kubernetes"));

    Information("Patch kubernetes config");
    TransformKubeDeployment();
});

Task("Build-Docker-Image").Does(() => {
    var versionedImageName = GetDockerImageNameWithVersion();
    var latestImageName = GetDockerLatestImageName();

    Information($"Build docker images: {versionedImageName}, {latestImageName}");

    var settings = new DockerImageBuildSettings {Tag = new[] {versionedImageName, latestImageName}};
    DockerBuild(settings, artifactDir);
});

Task("Login-Docker-Repository")
    .WithCriteria(dockerRegistry != dockerDefaultRegistry)
    .Does(() => {
        
    DockerLogin(dockerRegistryUsername, dockerRegistryPassword, dockerRegistry);
});

Task("Push-Docker-Image")
    .WithCriteria(dockerRegistry != dockerDefaultRegistry)
    .Does(() => {
    var versionedImageName = GetDockerImageNameWithVersion();
    var latestImageName = GetDockerLatestImageName();

    Information($"Push the images to the registry: {versionedImageName}, {latestImageName}");
    DockerPush(versionedImageName);
    DockerPush(latestImageName);
});

Task("Default")
    .IsDependentOn("Clean")
    .IsDependentOn("PrepareDirectories")
    .IsDependentOn("Restore")
    .IsDependentOn("Git-Version")    
    .IsDependentOn("Build")
    .IsDependentOn("Test")
    .IsDependentOn("Publish")
    .IsDependentOn("Publish-Dockerfile")
    .IsDependentOn("Publish-Kubernetes-Config")
    .IsDependentOn("Build-Docker-Image")
    .IsDependentOn("Login-Docker-Repository")
    .IsDependentOn("Push-Docker-Image");

RunTarget(target);

string GetVersion() {
    if (version != null) {
        return GetVersion(version);
    }

    return FileReadText(versionFile);
}

string GetVersion(GitVersion gitVersion) {
    return GetVersion(gitVersion.FullSemVer);
}

string GetVersion(string gitVersion) {
    return gitVersion.Replace('+', '.').ToLower();
}

string GetSolutionName() {
    return GetFiles("./../../../*.sln").First().GetFilenameWithoutExtension().ToString();
}

string GetProjectName() {
    return GetFiles("./../*.csproj").First().GetFilenameWithoutExtension().ToString();
}

string GetDockerImageNameWithVersion() {
    return GetDockerImageName(GetVersion());
}

string GetDockerLatestImageName() {    
    return GetDockerImageName("latest");
}

string GetDockerImageName(string version) {
    var solutionName = GetSolutionName();
    var projectName = GetProjectName();
    return $"{dockerRegistry}/{solutionName}.{projectName}:{version}".ToLower();
}

void TransformKubeDeployment() {
    var deploymentFile = System.IO.Path.Combine(artifactDir, "kubernetes") + "/manifest.yml";    

    var fileContent = TransformTextFile(deploymentFile)
        .WithToken("image-name", GetDockerImageNameWithVersion())
        .ToString();

    Information(deploymentFile + ": ");
    Information(fileContent);
    FileWriteText(deploymentFile, fileContent);
}