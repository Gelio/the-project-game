using System;
using System.Collections.Generic;
using System.Text;
using NUnit;
using NUnit.Framework;
using Moq;
using Player.Common;
using Player.Interfaces;
using Newtonsoft.Json;
using Player.Messages.Responses;
using Player.Messages.DTO;
using Player.GameObjects;
using System.IO;

namespace Player.Tests
{
    public class ConfigFileReaderTests
    {
        string _validConfigFile = "validConfigFile.json";
        string _invalidConfigFile = "invalidConfigFile.txt";
        string _nonexistingConfigFile = "nonexisting.lol";

        [OneTimeSetUp]
        public void SetUp()
        {
            File.Create(_invalidConfigFile).Close();

            string fileContent = @"{
""serverHostname"": ""localhost"",
""serverPort"": 4200,
""askLevel"": 10,
""respondLevel"": 8,
""teamNumber"": 1,
""isLeader"": false,
""timeout"": 10000,
""gameName"": ""Default""
}
";
            File.WriteAllText("validConfigFile.json", fileContent);
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            File.Delete("invalidConfigeFile.txt");
        }

        [Test]
        public void ReadConfigFileSuccess()
        {
            //Give
            var configFileReader = new ConfigFileReader();
            var expectedResult = new PlayerConfig
            {
                ServerHostname = "localhost",
                ServerPort = 4200,
                AskLevel = 10,
                RespondLevel = 8,
                TeamNumber = 1,
                IsLeader = false,
                Timeout = 10000,
                GameName = "Default"
            };

            //When
            var result = configFileReader.ReadConfigFile(_validConfigFile);

            //Then           
            Assert.That(result, Is.EqualTo(expectedResult));            
        }

        [Test]
        public void ReadConfigFileNonexistingFile()
        {
            //Give
            var configFileReader = new ConfigFileReader();

            //Then
            Assert.Throws<FileNotFoundException>(() => configFileReader.ReadConfigFile(_nonexistingConfigFile));
        }

        [Test]
        public void ReadConfigFileInvalidConfigFile()
        {
            //Give
            var configFileReader = new ConfigFileReader();

            //Then
            Assert.Throws<InvalidDataException>(() => configFileReader.ReadConfigFile(_invalidConfigFile));
        }
    }
}
