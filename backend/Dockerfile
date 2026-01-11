FROM eclipse-temurin:21-jre
WORKDIR /app
ENV TZ=UTC
COPY app.jar /app/app.jar
RUN mkdir -p /app/logs && chmod -R 777 /app/logs
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
