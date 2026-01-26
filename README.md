# MyBME280
Arduino library voor BME280 sensor via I2C
## Installatie

1. Download de repository als ZIP (knop “Code → Download ZIP”).
2. Open Arduino IDE.
3. Ga naar **Sketch → Include Library → Add .ZIP Library…**
4. Selecteer de gedownloade ZIP.
## Functies

- `begin()` – Start de sensor
- `getTemperature()` – Temperatuur in °C
- `getPressure()` – Druk in hPa
- `getHumidity()` – Vochtigheid in %RH
## Gebruik

```cpp
#include <MyBME280.h>

MyBME280 sensor;

void setup() {
  Serial.begin(115200);
  if (!sensor.begin()) {
    Serial.println("Sensor niet gevonden!");
    while (1);
  }
}

void loop() {
  Serial.print(sensor.getTemperature()); Serial.print("\t");
  Serial.print(sensor.getPressure()); Serial.print("\t");
  Serial.println(sensor.getHumidity());
  delay(1000);
}

---

### 📄 Overzicht van functies

```markdown

