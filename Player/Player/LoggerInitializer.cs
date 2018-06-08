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


            var filter = new NLog.Filters.ConditionBasedFilter();
            filter.Condition = "equals('${logger}', 'Player.MessageProvider')";
            filter.Action = NLog.Filters.FilterResult.Ignore;
            var rule = new NLog.Config.LoggingRule("*", LogLevel.Debug, consoleLog);
            rule.Filters.Add(filter);

            config.LoggingRules.Add(rule);

            NLog.LogManager.Configuration = config;
        }
    }
}
