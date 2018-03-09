# Informacje projektowe

## Wybrana metodyka

Extreme Programming

## Podział i opis ról

Wszystkie osoby z projektu są programistami i testerami.

Grzegorz Rozdzialik jest odpowiedzialny za sprawdzanie czy prace posuwają
się do przodu i ustalanie zadań.

Główną metodą współpracy jest programowanie w parach (pair programming). Jedna
z osób z pary pisze wtedy kod, a druga ją nadzoruje. W tym przypadku wymagana
jest duża ilość komunikacji, aby obie osoby miały wkład w dane zadanie.

## Podejście do testów

TDD - Test Driven Development

Testy będą pisane w miarę możliwości przed pisaniem implementacji.

Testy jednostkowe będą służyły szybkiemu sprawdzeniu implementacji.

Powinny być napisane także testy integracyjne.

## Repozytorium oraz CI

Repozytorium zostało utworzone na GitHubie.

Adres repozytorium: [https://github.com/Gelio/the-project-game](https://github.com/Gelio/the-project-game)

Jako serwer Continuous Integration został wybrany własny serwer typu VPS,
na którym działa Jenkins.

Adres serwera CI: [http://188.166.165.179:8080](http://188.166.165.179:8080)

## Technologie

### Player (gracz)

Moduł Gracza zostanie wykonany w C# (.NET Core 2.0).

Za rozwój tego modułu odpowiedzialni są:

* Andrzej Wódkiewicz
* Gustaw Żyngiel

### Communication Server (Serwer Komunikacyjny)

Moduł Serwera Komunikacyjnego zostanie wykonany w Typescript (Node.js).

Za rozwój tego modułu odpowiedzialni są:

* Anastasia Khlebous
* Przemysław Proszewski
* Grzegorz Rozdzialik

### Game Master (Mistrz Gry)

Moduł Mistrza Gry zostanie wykonany w Typescript (Node.js).

Za rozwój tego modułu odpowiedzialni są:

* Anastasia Khlebous
* Przemysław Proszewski
* Grzegorz Rozdzialik
