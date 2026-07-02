# Build a debug APK without installing Android tooling on the host.
# Image already ships Gradle 8.7 + JDK 17; we only add Android cmdline-tools + SDK platform 34.
FROM gradle:8.7-jdk17

RUN apt-get update \
 && apt-get install -y --no-install-recommends unzip wget \
 && rm -rf /var/lib/apt/lists/*

# Android command-line tools
RUN mkdir -p /android/cmdline-tools \
 && cd /android/cmdline-tools \
 && wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cli.zip \
 && unzip -q cli.zip \
 && mv cmdline-tools latest \
 && rm cli.zip

ENV ANDROID_HOME=/android
ENV ANDROID_SDK_ROOT=/android
ENV PATH=$PATH:/android/cmdline-tools/latest/bin:/android/platform-tools

RUN yes | sdkmanager --licenses > /dev/null 2>&1 || true
RUN sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

WORKDIR /proj
COPY settings.gradle build.gradle gradle.properties ./
COPY app ./app

# Build debug APK (self-signed by debug key → installable via "unknown apps").
RUN gradle assembleDebug --no-daemon --console=plain
