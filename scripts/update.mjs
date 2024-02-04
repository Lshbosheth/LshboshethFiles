import fetch from "node-fetch";
import { getOctokit, context } from "@actions/github";
import fs from "fs";

const token = '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';

async function updater() {
    if (!token) {
        console.log("GITHUB_TOKEN is required");
        process.exit(1);
    }

    // 用户名，仓库名
    const options = { owner: 'Lshbosheth', repo: 'LshboshethFiles' };
    const github = getOctokit(token);

    // 获取 tag
    const { data: tags } = await github.rest.repos.listTags({
        ...options,
        per_page: 10,
        page: 1,
    });
    console.log(tags);
    // 过滤包含 `v` 版本信息的 tag
    const tag = tags.find((t) => t.name.startsWith("v"));
    // console.log(`${JSON.stringify(tag, null, 2)}`);

    if (!tag) return;

    // 获取此 tag 的详细信息
    const { data: latestRelease } = await github.rest.repos.getReleaseByTag({
        ...options,
        tag: tag.name,
    });

    // 需要生成的静态 json 文件数据，根据自己的需要进行调整
    const updateData = {
        version: tag.name,
        pub_date: new Date().toISOString(),
        platforms: {
            win64: { signature: "", url: "" },
        },
    };

    const setAsset = async (asset, reg, platforms) => {
        let sig = "";
        if (/.sig$/.test(asset.name)) {
            sig = await getSignature(asset.browser_download_url);
            await getSignatureTest(asset.browser_download_url)
        }
        platforms.forEach((platform) => {
            console.log(asset.name, platform, reg.test(asset.name));

            if (reg.test(asset.name)) {
                // 设置平台签名，检测应用更新需要验证签名
                console.log(sig)
                if (sig) {
                    updateData.platforms[platform].signature = sig;
                    return;
                }
                // 设置下载链接
                console.log(asset.browser_download_url, asset.name);
                updateData.platforms[platform].url = asset.browser_download_url;
            }
        });
    };

    const promises = latestRelease.assets.map(async (asset) => {
        // windows
        await setAsset(asset, /.msi.zip/, ["win64"]);
    });
    await Promise.allSettled(promises);

    if (!fs.existsSync("updater")) {
        fs.mkdirSync("updater");
    }
    console.log(updateData);
    // 将数据写入文件
    fs.writeFileSync(
        "./updater/version.json",
        JSON.stringify(updateData, null, 2)
    );
    console.log("Generate updater/version.json");
}

updater().catch(console.error);

// 获取签名内容
async function getSignature(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/octet-stream" },
        });
        return response.text();
    } catch (_) {
        return "";
    }
}
async function getSignatureTest(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
        });
        const text = await response.text();
        const blob = await response.blob();
        console.log("text", text);
        console.log("blob", blob);
    } catch (_) {
        return "";
    }
}
