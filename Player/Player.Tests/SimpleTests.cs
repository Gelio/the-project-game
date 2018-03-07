using System;
using NUnit;
using NUnit.Framework;

namespace Player.Tests
{
    [TestFixture]
    class SimpleTests
    {
        [Test]
        public void AlwaysPasses()
        {
            Assert.That(true);
        }
    }
}
