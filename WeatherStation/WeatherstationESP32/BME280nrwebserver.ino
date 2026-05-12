#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

#define SEALEVELPRESSURE_HPA (1013.25)

// WiFi credentials
const char* ssid = "Network";          // WiFi network name
const char* password = "password"; // WiFi password

// Flask server
const char* serverName = "http://172.16.7.152:9090/bme280"; // Server IP address

// BME280 object
Adafruit_BME280 bme;

void setup() {
  Serial.begin(9600);

  // Start I2C communication
  Wire.begin(21, 22);

  // Connect to WiFi
  Serial.print("Connecting to WiFi");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Start BME280 sensor
  bool status = bme.begin(0x76); // Can also be 0x77 depending on the sensor configuration of the BME280 module

  if (!status) {
    Serial.println("BME280 sensor not found!");
    while (1);
  }

  Serial.println("BME280 sensor detected!");
}

void loop() { // Main loop

  // Read sensor values
  float temperature = bme.readTemperature();
  float humidity = bme.readHumidity();
  float pressure = bme.readPressure() / 100.0F;

  // Display values in Serial Monitor
  Serial.println("----- MEASUREMENT -----");

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" °C");

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Pressure: ");
  Serial.print(pressure);
  Serial.println(" hPa");

  // Send data to server
  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;

    http.begin(serverName);

    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    // Create POST data
    String httpRequestData =
      "temperature=" + String(temperature) +
      "&humidity=" + String(humidity) +
      "&pressure=" + String(pressure);

    Serial.println("Sending:");
    Serial.println(httpRequestData);

    // Send POST request
    int httpResponseCode = http.POST(httpRequestData);

    // Display server response
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    String response = http.getString();

    Serial.print("Server response: ");
    Serial.println(response);

    http.end();

  } else {
    Serial.println("WiFi connection lost");
  }

  Serial.println();

  // Wait 5 minutes before next measurement cycle
  delay(300000);
}