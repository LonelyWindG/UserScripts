// ==UserScript==
// @name         Microsoft & Xbox 网站地区&语言快捷切换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速切换微软及Xbox的网站地区&语言!
// @author       Wind
// @match        https://*.xbox.com/*
// @match        https://*.microsoft.com/*
// @icon         https://www.microsoft.com/favicon.ico
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

const builtin_regions = [ "[zh-CN]中国", "[zh-HK]香港", "[zh-TW]台湾", "[zh-SG]新加坡", "[en-US]美国" ];
registerRegions();

function registerRegions(){
    var regions = listRegions();
    for(var region of regions)
    {
        if (region.length < 7 || region[0] != '[' || region[6] != ']') continue;

        var code = region.substring(1, 6);
        GM_registerMenuCommand(region, createChangeCommand(code));
    }
    GM_registerMenuCommand("说明", explain);
}

function listRegions(){
    var regions = GM_getValue("regions", null);
    if (regions == null || regions == undefined)
    {
        GM_setValue("regions", builtin_regions);
        return builtin_regions;
    }

    return regions;
}

function explain(){
    alert("地区增删或顺序修改可通过编辑脚本存储的regions项实现;\n地区格式形如\"[xx-XX]地区名称\", xx-XX为地区代码, \n前两位为ISO 639-1语言代码, 后两位为ISO_3166-1地区代码, 中间以-作为分隔符");
}

function createChangeCommand(code)
{
    return function() { change(code) };
}

function change(code){
    var url = document.URL;
    var strs = url.split('/');
    if (strs.length < 4){
        alert("当前URL内不包含地区代码, 无法替换");
        return;
    }
    if (code.length != 5 || code[2] != '-')
    {
        alert(`地区代码[${code}]无效, 编码中间分隔符必须是-且长度必须为5`);
        return;
    }

    code = code.toLowerCase();
    var urlRegion = strs[3];
    if (urlRegion.toLowerCase() == code)
    {
        alert("已是该地区, 无需切换");
        return;
    }

    window.location.href = url.replace(urlRegion, code);
}
