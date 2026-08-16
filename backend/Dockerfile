# Build stage: compile the Spring Boot app with Maven on Java 26
FROM eclipse-temurin:26-jdk AS build
WORKDIR /app

# Install Maven (the official maven image does not ship a Java 26 tag yet)
ENV MAVEN_VERSION=3.9.9
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL -o /tmp/maven.tar.gz \
        "https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" \
    && mkdir -p /opt/maven \
    && tar -xzf /tmp/maven.tar.gz -C /opt/maven --strip-components=1 \
    && ln -s /opt/maven/bin/mvn /usr/local/bin/mvn \
    && rm /tmp/maven.tar.gz

COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests

# Run stage: minimal JRE image
FROM eclipse-temurin:26-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Keep memory inside Render's free 512 MB limit
ENV JAVA_OPTS="-Xmx256m -XX:MaxMetaspaceSize=128m"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]