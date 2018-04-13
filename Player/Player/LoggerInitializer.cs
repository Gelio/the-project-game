using NLog;

namespace Player
{
    public static class LoggerInitializer
    {
        public static void InitializeLogger()
        {
            var config = new NLog.Config.LoggingConfiguration();

            var consoleLog = new NLog.Targets.ColoredConsoleTarget() { Name = "consoleLog" };

            consoleLog.Layout = @"${date:format=yyyy-MM-dd HH\:mm\:ss} | ${pad:padding=-5:inner=${level:uppercase=true}} | ${logger} | ${message} ${exception:format=message}";

            config.LoggingRules.Add(new NLog.Config.LoggingRule("*", LogLevel.Trace, consoleLog));

            NLog.LogManager.Configuration = config;
        }
    }
}
