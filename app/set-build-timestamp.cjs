const fs = require("fs");
const path = require("path");

function setTimestamp(filePath, now) {
    if (!filePath || !fs.existsSync(filePath)) {
        return;
    }

    fs.utimesSync(filePath, now, now);

    console.log(
        `[build timestamp] ${filePath} -> ${now.toISOString()}`
    );
}

exports.default = async function (context) {
    const now = new Date();

    if (Array.isArray(context.artifactPaths)) {
        for (const artifactPath of context.artifactPaths) {
            setTimestamp(artifactPath, now);
        }

        return [];
    }

    if (!context.appOutDir) {
        return;
    }

    const appName = context.packager.appInfo.productFilename;

    switch (context.electronPlatformName) {
        case "darwin":
            setTimestamp(
                path.join(context.appOutDir, `${appName}.app`),
                now
            );
            break;

        case "win32":
            setTimestamp(
                path.join(context.appOutDir, `${appName}.exe`),
                now
            );
            break;

        case "linux":
            setTimestamp(
                path.join(context.appOutDir, appName),
                now
            );
            break;
    }
};