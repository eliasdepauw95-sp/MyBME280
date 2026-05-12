# WeatherStation

A small end-to-end weather station project built with an **ESP32**, a **BME280 sensor**, a **Flask web server**, and **SQLite**.

The ESP32 reads temperature, humidity, and air pressure from the sensor and sends the values to the Flask application. The server stores the latest measurements in a local SQLite database and shows them on a dashboard with live charts.

## Features

- Reads **temperature**, **humidity**, and **pressure** from a BME280
- Sends measurements from the ESP32 to the server over HTTP
- Stores data in SQLite
- Keeps only the **latest 120 measurements**
- Shows the latest reading on a web dashboard
- Displays charts and quick stats for all three values
- Includes auto-refresh for near-live monitoring

## Project structure

```text
WeatherStation/
|-- README.md
|-- WeatherstationESP32/
|   `-- BME280nrwebserver.ino
`-- WeatherstationServer/
    |-- app.py
    |-- db.py
    |-- sql/
    |   |-- weerstation.sql
    |   `-- weerstation.db
    |-- static/
    |   |-- index.js
    |   `-- style.css
    `-- templates/
        |-- base.html
        `-- index.html
```

## How it works

1. The ESP32 connects to Wi-Fi.
2. The BME280 sensor is read every 5 minutes.
3. The ESP32 sends a `POST` request to `/bme280` with:
   - `temperature`
   - `humidity`
   - `pressure`
4. The Flask server stores the values in SQLite.
5. The dashboard at `/` shows the latest data and graphs.

## Requirements

### Hardware

- ESP32
- BME280 sensor
- Jumper wires

### Software

- Python 3
- Flask
- Arduino IDE
- ESP32 board support in Arduino IDE
- Libraries for the ESP32 sketch:
  - `WiFi.h`
  - `HTTPClient.h`
  - `Wire.h`
  - `Adafruit Sensor`
  - `Adafruit BME280`

## Wiring

The sketch uses:

- `SDA -> GPIO 21`
- `SCL -> GPIO 22`

The sensor is initialized at I2C address `0x76`.
Some BME280 modules use `0x77`, so change that in the sketch if needed.

## Server setup

Open a terminal in `WeatherStation/WeatherstationServer`.

### 1. Create the database

The database schema is defined in `sql/weerstation.sql`.

Run:

```bash
python db.py
```

### 2. Install Flask

```bash
pip install flask
```

### 3. Start the server

```bash
python app.py
```

The app starts on:

```text
http://0.0.0.0:9090
```

On your own machine, you will usually open:

```text
http://127.0.0.1:9090
```

## ESP32 setup

Open `WeatherStation/WeatherstationESP32/BME280nrwebserver.ino` in Arduino IDE and update:

- `ssid`
- `password`
- `serverName`

Example:

```cpp
const char* ssid = "YourWiFi";
const char* password = "YourPassword";
const char* serverName = "http://192.168.1.10:9090/bme280";
```

Important:

- The ESP32 and the computer running Flask must be on the **same network**
- `serverName` must point to the **local IP address of your Flask server**
- The Flask server must be running before the ESP32 sends data

Then upload the sketch to the ESP32.

## HTTP endpoint

### `POST /bme280`

Accepted form fields:

- `temperature`
- `humidity`
- `pressure`

Response:

```text
ok
```

### `GET /`

Opens the dashboard with:

- the latest measurement
- summary stats
- line charts for temperature, humidity, and pressure

## Database

The application stores data in four tables:

- `temperatuur`
- `luchtvochtigheid`
- `luchtdruk`
- `time`

Each new measurement is inserted into the value tables and linked through the `time` table with a timestamp.

To keep the database small, the application deletes older rows and keeps only the **120 newest records**.

## Notes

- The Flask app currently runs with `debug=True`, which is useful for development but not for production
- The SQLite database path is relative, so start the server from the `WeatherstationServer` folder
- The measurement interval in the ESP32 sketch is `300000 ms` which equals **5 minutes**

## Demo flow

1. Start the Flask server
2. Power the ESP32
3. Wait for the first measurement to be sent
4. Open the dashboard in your browser
5. Watch the charts fill with new measurements over time

## Future ideas

- Add a `requirements.txt`
- Add daily or weekly history views
- Export data as CSV
- Add min/max alerts
- Show sensor status and connection health

## License

Use and adapt this project freely for learning and school work unless your class or organization requires a different license.
