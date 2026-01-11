FROM eclipse-temurin:21-jre
WORKDIR /app
ENV TZ=UTC
COPY app.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
