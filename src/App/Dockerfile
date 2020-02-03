FROM microsoft/dotnet:2.2-aspnetcore-runtime
EXPOSE 80
WORKDIR /data
COPY publish/ .
ENTRYPOINT dotnet Partie.Web.App.dll