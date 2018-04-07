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
        string _validConfigFilePath = "validConfigFile.json";
        string _invalidConfigFilePath = "invalidConfigFile.txt";
        string _nonexistingConfigFilePath = "nonExistingFile.xyz";

        [OneTimeSetUp]
        public void SetUp()
        {
            string fileContent = @"{
""serverHostname"": ""localhost"",
""serverPort"": 4200,
""askLevel"": 10,
""respondLevel"": 8,
""teamNumber"": 1,
""isLeader"": false,
""timeout"": 10000,
""gameName"": ""Default""
}";
            File.WriteAllText(_validConfigFilePath, fileContent);
            File.Create(_invalidConfigFilePath).Close();
            File.WriteAllText(fileContent, ConfigFileReader.DefaultConfigFilePath);
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            File.Delete(_validConfigFilePath);
            File.Delete(_invalidConfigFilePath);
            File.Delete(ConfigFileReader.DefaultConfigFilePath);
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
            var result = configFileReader.ReadConfigFile(_validConfigFilePath);

            //Then
            Assert.That(result, Is.EqualTo(expectedResult));
        }

        [Test]
        public void ReadConfigFileNonexistingFile()
        {
            //Give
            var configFileReader = new ConfigFileReader();

            //Then
            Assert.Throws<FileNotFoundException>(() => configFileReader.ReadConfigFile(_nonexistingConfigFilePath));
        }

        [Test]
        public void ReadConfigFileInvalidConfigFile()
        {
            //Give
            var configFileReader = new ConfigFileReader();

            //Then
            Assert.Throws<InvalidDataException>(() => configFileReader.ReadConfigFile(_invalidConfigFilePath));
        }

        [Test]
        public void ReadConfigFileDefault()
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
            var result = configFileReader.ReadConfigFile(String.Empty);

            //Then
            Assert.That(result, Is.EqualTo(expectedResult));
        }
    }
}
