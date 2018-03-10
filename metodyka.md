# Informacje projektowe

## Wybrana metodyka

Extreme Programming

## Role i realizacja metodyki

Wszystkie osoby z projektu są jednocześnie programistami i testerami.

Dodatkowo, Grzegorz Rozdzialik jest osobą odpowiedzialną za nadzorowanie pracy zespołu
oraz ustalanie kolejnych zadań.

Główną metodą współpracy jest programowanie w parach (pair programming).
W sytuacjach wyjątkowych stosowana jest praca indywidualna połączona z dogłębną weryfikacją kodu.

Podczas pracy nad każdym z zadań stawiany jest duży nacisk na komunikację między członkami zespołu.

## Podejście do testów

TDD - Test Driven Development

Testy będą pisane w miarę możliwości przed pisaniem implementacji.

Testy jednostkowe będą służyły szybkiemu sprawdzeniu implementacji.

Powinny być napisane także testy integracyjne.

## Repozytorium oraz CI

Repozytorium zostało utworzone na GitHubie.

Adres repozytorium: [https://github.com/Gelio/the-project-game](https://github.com/Gelio/the-project-game)

Continuous Integration jest zapewnione poprzez instancję Jenkinsa zainstalowaną na VPS-ie.

Adres serwera CI: [http://188.166.165.179:8080](http://188.166.165.179:8080)

## Technologie

### Player (Gracz)

Moduł Gracza zostanie wykonany w C# (.NET Core 2.0).

Osoby odpowiedzialne za moduł:

* Andrzej Wódkiewicz
* Gustaw Żyngiel

### Communication Server (Serwer Komunikacyjny)

Moduł Serwera Komunikacyjnego zostanie wykonany w Typescript (Node.js).

Osoby odpowiedzialne za moduł:

* Anastasia Khlebous
* Przemysław Proszewski
* Grzegorz Rozdzialik

### Game Master (Mistrz Gry)

Moduł Mistrza Gry zostanie wykonany w Typescript (Node.js).

Osoby odpowiedzialne za moduł:

* Anastasia Khlebous
* Przemysław Proszewski
* Grzegorz Rozdzialik
