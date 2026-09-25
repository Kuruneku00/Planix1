plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.planner.smartapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.planner.smartapp"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }
signingConfigs {
    create("release") {
        val storeFilePath = project.findProperty("RELEASE_STORE_FILE") as String?
        val storePasswordValue = project.findProperty("RELEASE_STORE_PASSWORD") as String?
        val keyAliasValue = project.findProperty("RELEASE_KEY_ALIAS") as String?
        val keyPasswordValue = project.findProperty("RELEASE_KEY_PASSWORD") as String?

        if (storeFilePath != null) {
            storeFile = file(storeFilePath)
        }

        if (storePasswordValue != null) {
            storePassword = storePasswordValue
        }

        if (keyAliasValue != null) {
            keyAlias = keyAliasValue
        }

        if (keyPasswordValue != null) {
            keyPassword = keyPasswordValue
        }
    }
}

buildTypes {
    release {
        isMinifyEnabled = false
        signingConfig = signingConfigs.getByName("release")
        proguardFiles(
            getDefaultProguardFile("proguard-android-optimize.txt"),
            "proguard-rules.pro"
        )
    }
}

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }

    kotlinOptions {
        jvmTarget = "21"
    }
}

dependencies {
    implementation(project(":capacitor-android"))
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.activity:activity-ktx:1.9.0")
    implementation("androidx.core:core-splashscreen:1.0.1")
}

apply(from = "capacitor.build.gradle")
