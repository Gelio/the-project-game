using NUnit.Framework;

namespace Player.Tests
{
    [SetUpFixture]
    class TestsSetup
    {
        [OneTimeSetUp]
        public void GlobalSetup()
        {
            MapperInitializer.InitializeMapper();
        }
    }
}
