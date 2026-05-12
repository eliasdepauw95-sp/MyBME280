#include <MyBME280.h>


void setup() {
  Serial.begin(9600);
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