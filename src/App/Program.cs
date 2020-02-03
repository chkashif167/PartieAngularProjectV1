using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Partie.Logging;

namespace Partie.Web.App
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).RunWithLogging("Partie.Web.App", Environment.GetEnvironmentVariable("ApplicationInsights__InstrumentationKey"));
        }

        private static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UsePartieLogging<Startup>()
                .Build();
    }
}