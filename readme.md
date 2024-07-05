# API für ToDo-Anwendungen

Zum Starten der Anwendung in der Konsole `./todoApi` ausführen. Der Server hört auf den Port `9002`.

Im Folgenden werden die Schnittstellen der ToDo-API definiert.

Um die Schnittstelle nutzen zu können, ist eine Authentifizierung notwendig.

## Authentifizierung

Folgende Schnittstelle wird für die Authentifizierung benötigt:

### Request

POST `http://localhost:9002/login`

```json
{
  "username": "max.muster",
  "password": "Anmeldung1"
}
```

Als Rückgabewert kommt folgendes User-Objekt:

### Response

```json
{
  "vorname": "Max",
  "nachname": "Muster",
  "email": "max@muster.de",
  "token": "random-token"
}
```

Das Token muss in den nachfolgenden Requests **immer** als Header in folgender Form mitgegeben werden:

`token: random-token`

wobei random-token der Wert aus dem User-Objekt ist. Der Header ist case-sensitiv.

## ToDo's abholen

Um alle ToDos abzuholen wird folgende Schnittstelle benötigt.

`GET http://localhost:9002/todos`
Die Schnittstelle liefert eine Liste folgender Objekte:

```json
{
  "id": 1,
  "beschreibung": "Was ist zu tun",
  "faellig": 12345,
  "prioritaet": 1,
  "erledigt": true
}
```

Wobei

- `faellig`: Ist ein Unix-Timestamp
- `prioritaet`: Integer in der Range 1-4

Für den textuellen Wert der Prioritäten wird folgende Schnittstelle benötigt:

`GET http://localhost:9002/prios`

Diese kommen als Liste in folgender Form zurück:

```json
{
  "id": 1,
  "label": "Normal"
}
```

Die `id` entspricht hierbei dem Wert der `prioritaet` im ToDo.

Ein einzelner Task kann auch via ID abgeholt werden, dazu wird folgende Schnittstelle verwendet:

`GET http://localhost:9002/todo/:id`

## ToDo's bearbeiten

Um ein neues ToDo-Objekt hinzuzufügen, muss folgende Schnittstelle verwendet werden:

`PUT http://localhost:9002/todo`

Der Requestbody entspricht dem eines ToDos **ohne** ID.

---

Um ein ToDo-Objekt zu bearbeiten, muss folgende Schnittstelle angefragt werden:

`POST http://localhost:9002/todo/:id`

Der Requestbody entspricht dem eines Todo **ohne** der ID.

---

Um ein ToDo-Objekt endgültig zu löschen muss folgende Schnittstelle verwendet werden:

Beim Erzeugen und Aktualisieren wird jeweils das aktualisierte ToDo zurückgeschickt.

`DELETE http://localhost:9002/todo/:id`

Der Parameter `id` entspricht der ID des ToDo-Objekts.