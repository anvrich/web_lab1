FROM gradle:8.3-jdk17 AS build

WORKDIR /app

COPY . .

RUN gradle build -x test

FROM eclipse-temurin:17-jre

EXPOSE 1337

RUN mkdir /app
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-DFCGI_PORT=1337", "-jar", "app.jar"]
