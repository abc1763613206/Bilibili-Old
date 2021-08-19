"use strict";
class Ui {
    /**
     * UI顶层
     */
    static box;
    /**
     * 工具栏按钮栏
     */
    static tool;
    /**
     * 分类菜单栏
     */
    static menu;
    /**
     * 设置实际界面
     */
    static item;
    /**
     * 输入框历史缓存
     */
    static history;
    constructor() {
        const His = GM.getValue("history", {});
        Ui.history = new Proxy(His, {
            set: (_target, p, value) => {
                His[p] = value;
                GM.setValue("history", His);
                return true;
            },
            get: (_target, p) => His[p]
        });
        this.entry();
        API.addCss(GM.getResourceText("ui.css"));
    }
    /**
     * 初始化设置
     */
    config() {
        let ini = GM.getValue("config", {});
        Object.entries(ini).forEach(k => config[k[0]] = k[1]);
    }
    /**
     * 呈现设置界面
     * 指定 key 将直接滚动到指定设置
     * @param key 设置主键，添加设置时那个key，用于直接滚动到该设置
     */
    draw(key) {
        document.querySelector(".border-box")?.remove();
        this.config();
        Ui.borderBox();
        setting.reduce((s, d) => {
            !s.includes(d.sort.key) && (Ui.menuitem(d.sort), s.push(d.sort.key));
            Ui.index(d);
            return s;
        }, []);
        document.body.appendChild(Ui.box);
        key && Ui.item.querySelector(`value-contain ${key}`);
    }
    /**
     * 绘制设置按钮
     */
    async entry() {
        if (document.readyState !== 'complete') {
            await new Promise(r => window.addEventListener('load', r));
        }
        let div = document.createElement("div");
        div.setAttribute("class", "setting-entry icon");
        div.innerHTML = `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></svg>`;
        document.body.appendChild(div);
        div.onclick = () => this.draw();
        div.onmouseover = () => div.style.opacity = "0.8";
        setTimeout(() => {
            div.style.opacity = "0";
            div.onmouseout = () => div.style.opacity = "0";
        }, 2e3);
    }
    /**
     * 设置分类
     * @param obj 设置内容
     * @param node 父节点
     * @returns 设置节点
     */
    static index(obj, node) {
        let result;
        switch (obj.type) {
            case "action":
                result = Ui.action(obj, node);
                break;
            case "file":
                result = Ui.file(obj, node);
                break;
            case "input":
                result = Ui.input(obj, node);
                break;
            case "mutlti":
                result = Ui.multi(obj, node);
                break;
            case "picture":
                result = Ui.picture(obj, node);
                break;
            case "row":
                result = Ui.row(obj, node);
                break;
            case "sort":
                result = Ui.sort(obj, node);
                break;
            case "switch":
                result = Ui.switch(obj, node);
                break;
        }
        return result;
    }
    /**
     * 创建顶层UI
     */
    static borderBox() {
        this.box = document.createElement("div");
        this.box.setAttribute("class", "border-box");
        this.box.innerHTML = `<div class="box-tool"></div>
            <div class="box-content">
                <div class="box-contain">
                    <div class="item-menu"></div>
                    <div class="item-contain"></div>
                </div>
            </div>`;
        this.tool = this.box.children[0];
        this.menu = this.box.children[1].children[0].children[0];
        this.item = this.box.children[1].children[0].children[1];
        this.toolIcon({
            type: "icon",
            svg: '<svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#212121" stroke-linecap="round"></path></svg>',
            title: "关闭",
            action: (node) => node.remove()
        });
    }
    /**
     * 添加工具栏按钮
     * @param obj 按钮配置数据
     */
    static toolIcon(obj) {
        let div = this.icon(obj.svg);
        div.setAttribute("title", obj.title);
        this.tool.insertBefore(div, this.tool.firstChild);
        div.onclick = () => obj.action(this.box);
    }
    /**
     * 添加菜单栏
     * @param arr 菜单数据
     */
    static menuitem(obj) {
        let div = document.createElement("div");
        div.setAttribute("class", "menuitem");
        obj.svg && div.appendChild(this.icon(obj.svg));
        div.appendChild(document.createTextNode(obj.name));
        this.menu.appendChild(div);
        div.onclick = () => {
            let selected = this.menu.querySelector(".menuitem.selected");
            let itembox = this.item.querySelector(`.menu-contain.${obj.key}`);
            selected && selected.setAttribute("class", "menuitem");
            itembox && itembox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            div.setAttribute("class", "menuitem selected");
        };
    }
    /**
     * 添加菜单组合项
     * @param obj 菜单项
     * @returns 组合框节点，用以添加设计设置项
     */
    static itemContain(obj) {
        let div = this.item.querySelector(`.menu-contain.${obj.key}`);
        if (!div) {
            div = document.createElement("div");
            div.setAttribute("class", `menu-contain ${obj.key}`);
            div.innerHTML = `<div class="menu-header">
                    <h2 class="title">${obj.name}</h2>
                </div>
                <div class="menu-card"></div>`;
            this.item.appendChild(div);
        }
        return div.children[1];
    }
    /**
     * 创建图标节点
     * @param svg 图标 svg 字符串
     * @returns 图标节点
     */
    static icon(svg) {
        let div = document.createElement("div");
        div.setAttribute("class", "icon");
        div.innerHTML = svg;
        return div;
    }
    /**
     * 创建浮动信息，鼠标移动该节点上时显示
     * @param node 浮动信息所属节点
     * @param data 浮动信息内容
     */
    static float(node, data) {
        let div = document.createElement("div");
        div.setAttribute("class", "dialog-float");
        div.innerHTML = `<div class="arrow"></div><div class="message">${data}</div>`;
        node.onmouseover = (ev) => {
            document.body.appendChild(div);
            let rect = div.getBoundingClientRect();
            div.style.left = `${node.getBoundingClientRect().x + ev.offsetX}px`;
            div.style.top = `${node.getBoundingClientRect().y + ev.offsetY - rect.height}px`;
            div.style.width = `${Math.sqrt(rect.width * rect.height) * 4 / 3}px`;
        };
        node.onmouseout = () => div.remove();
    }
    /**
     * 添加纯图片设置
     * @param obj 设置内容
     * @param node 父节点
     * @returns 设置节点
     */
    static picture(obj, node) {
        node = node || this.itemContain(obj.sort);
        let div = document.createElement("div");
        div.setAttribute("class", `value-contain picture`);
        div.innerHTML = `<picture><img src="${obj.src}"></picture>`;
        node && node.appendChild(div);
        return div;
    }
    /**
     * 添加开关设置
     * @param obj 设置内容
     * @param node 父节点
     * @returns 设置节点
     */
    static switch(obj, node) {
        node = node || this.itemContain(obj.sort);
        let div = document.createElement("div");
        div.setAttribute("class", `value-contain ${obj.key}`);
        obj.svg && div.appendChild(this.icon(obj.svg));
        div.innerHTML += `<div class="label">${obj.label}</div>
            <div class="switch">
                <span class="bar"></span>
                <span class="knob"><i class="circle"></i></span>
            </div>`;
        obj.sub && (div.querySelector(".label").innerHTML = `${obj.label}<div class="sub">${obj.sub}</div>`);
        config.hasOwnProperty(obj.key) ? (obj.value = config[obj.key]) : (config[obj.key] = obj.value);
        obj.value && (div.querySelector(".bar").setAttribute("checked", "checked"),
            div.querySelector(".knob").setAttribute("checked", "checked"),
            div.querySelector(".circle").setAttribute("checked", "checked"));
        obj.float && this.float(div, obj.float);
        node && node.appendChild(div);
        div.onclick = () => {
            obj.value = !obj.value;
            obj.value ? (div.querySelector(".bar").setAttribute("checked", "checked"),
                div.querySelector(".knob").setAttribute("checked", "checked"),
                div.querySelector(".circle").setAttribute("checked", "checked")) :
                (div.querySelector(".bar").removeAttribute("checked"),
                    div.querySelector(".knob").removeAttribute("checked"),
                    div.querySelector(".circle").removeAttribute("checked"));
            config[obj.key] = obj.value;
            obj.action && obj.action.call(div, obj.value);
        };
        return div;
    }
    /**
     * 添加下拉设置
     * @param obj 设置内容
     * @param node 父节点
     * @returns 设置节点
     */
    static row(obj, node) {
        node = node || this.itemContain(obj.sort);
        let div = document.createElement("div");
        div.setAttribute("class", `value-contain ${obj.key}`);
        obj.svg && div.appendChild(this.icon(obj.svg));
        div.innerHTML += `<div class="label">${obj.label}</div><div class="row"><select>`;
        obj.list.forEach(d => div.innerHTML += `<option>${d}</option>`);
        div.innerHTML += '</select></div>';
        config.hasOwnProperty(obj.key) ? (obj.value = config[obj.key]) : (config[obj.key] = obj.value);
        let select = div.querySelector("select");
        select.value = obj.value;
        obj.float && this.float(div, obj.float);
        node && node.appendChild(div);
        select.onchange = () => {
            config[obj.key] = select.value;
            obj.action && obj.action.call(div, select.value);
        };
        return div;
    }
    /**
     * 添加归档设置
     * @param obj 设置内容
     * @param node 父节点
     * @returns 设置节点
     */
    static sort(obj, node) {
        node = node || this.itemContain(obj.sort);
        let div = document.createElement("div");
        let sec = document.createElement("div");
        let flag = false;
        let item;
        div.setAttribute("class", `value-contain ${obj.key}`);
        sec.setAttribute("class", "vaule-sec-contain");
        obj.svg && div.appendChild(this.icon(obj.svg));
        div.innerHTML += `<div class="label">${obj.label}</div>
            <div class="anchor">
                <div class="icon">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"role="none"style="pointer-events: none; display: block; width: 100%; height: 100%;">
                        <g><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g>
                    </svg>
                </div>
            </div>`;
        obj.float && this.float(div, obj.float);
        node && node.appendChild(div) && node.appendChild(sec);
        item = obj.list.reduce((s, d) => {
            let temp = this.index(d, sec);
            temp.style.display = "none";
            s.push(temp);
            return s;
        }, []);
        div.querySelector(".anchor").onclick = () => {
            flag = !flag;
            flag ? item.forEach(d => d.style.display = "flex") : item.forEach(d => d.style.display = "none");
        };
        return div;
    }
    /**
     * 添加按钮菜单
     * @param obj 设置内容
     * @param node 父节点
     * @returns 设置节点
     */
    static action(obj, node) {
        node = node || this.itemContain(obj.sort);
        let div = document.createElement("div");
        div.setAttribute("class", `value-contain ${obj.key}`);
        obj.svg && div.appendChild(this.icon(obj.svg));
        div.innerHTML += `<div class="label">${obj.label}</div><div class="action">${obj.title}</div>`;
        obj.float && this.float(div, obj.float);
        node && node.appendChild(div);
        div.querySelector(".action").onclick = () => obj.action.call(div);
        return div;
    }
    /**
     * 添加输入框设置
     * @param obj 设置内容
     * @param node 父节点
     * @returns 设置节点
     */
    static input(obj, node) {
        node = node || this.itemContain(obj.sort);
        let div = document.createElement("div");
        let history = [];
        div.setAttribute("class", `value-contain ${obj.key}`);
        obj.svg && div.appendChild(this.icon(obj.svg));
        let html = `<div style="padding-inline-end: 12px;flex: 1;flex-basis: 0.000000001px;padding-block-end: 12px;padding-block-start: 12px;">${obj.label}</div>
            <div class="textbox">`;
        obj.key ? (html += `<input list="list-${obj.key}"></input><datalist id="list-${obj.key}"></datalist><div class="icon" title="清除历史"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"style="pointer-events: none; display: block; width: 100%; height: 100%;"><g><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></g></svg></div></div>`) : div.innerHTML += `<input></input></div>`;
        obj.title && (html += `<div class="button">${obj.title}</div>`);
        div.innerHTML += html;
        (history = this.history[obj.key] || [],
            history.reduce((s, d) => {
                s.innerHTML += `<option value="${d}"></option>`;
                return s;
            }, div.querySelector("datalist")),
            div.querySelector('.icon[title="清除历史"]').style.display = "none");
        obj.float && this.float(div, obj.float);
        node && node.appendChild(div);
        let input = div.querySelector("input");
        let clear = div.querySelector('.icon[title="清除历史"]');
        obj.value && config.hasOwnProperty(obj.key) ? (obj.value = config[obj.key]) : (config[obj.key] = obj.value);
        obj.value && (input.value = obj.value);
        input.parentNode.onmouseover = () => history[0] && (clear.style.display = "block");
        input.parentNode.onmouseout = () => clear.style.display = "none";
        clear.onclick = () => {
            history = this.history[obj.key] = [];
            div.querySelectorAll("option").forEach(d => d.remove());
            clear.style.display = "none";
        };
        input.onchange = () => {
            obj.value && (config[obj.key] = input.value);
            !history.includes(input.value) && history.push(input.value) && (this.history[obj.key] = history);
            API.toast.warning(`数值已变更：${input.value}`);
            obj.action && obj.action.call(div, input.value);
        };
        obj.title && (div.querySelector(".button").onclick = () => {
            if (!input.value || (config[obj.key] == input.value))
                return;
            obj.value && (config[obj.key] = input.value);
            !history.includes(input.value) && history.push(input.value) && (this.history[obj.key] = history);
            API.toast.warning(`数值已变更：${input.value}`);
            obj.action && obj.action.call(div, input.value);
        });
        return div;
    }
    /**
     * 添加文件选择设置
     * @param obj 设置内容
     * @param node 父节点
     * @returns 设置节点
     */
    static file(obj, node) {
        node = node || this.itemContain(obj.sort);
        let div = document.createElement("div");
        div.setAttribute("class", `value-contain ${obj.key}`);
        obj.svg && div.appendChild(this.icon(obj.svg));
        div.innerHTML += `<div class="label">${obj.label}</div><div class="button">${obj.title}</div><input type="file" style="width: 0;"></input>`;
        let input = div.querySelector("input");
        obj.accept && (input.accept = obj.accept.join(","));
        obj.multiple && (input.multiple = true);
        obj.float && this.float(div, obj.float);
        node && node.appendChild(div);
        div.querySelector(".button").onclick = () => input.click();
        input.onclick = () => input.value = "";
        input.onchange = () => input.files && obj.action.call(div, input.files);
        return div;
    }
    /**
     * 添加复选设置
     * @param obj 设置内容
     * @param node 父节点
     * @returns 设置节点
     */
    static multi(obj, node) {
        node = node || this.itemContain(obj.sort);
        let div = document.createElement("div");
        div.setAttribute("class", `value-contain ${obj.key}`);
        obj.svg && div.appendChild(this.icon(obj.svg));
        div.innerHTML += `<div class="label">${obj.label}</div>`;
        config.hasOwnProperty(obj.key) ? (obj.value = config[obj.key]) : (config[obj.key] = obj.value);
        obj.list.forEach(d => {
            div.innerHTML += obj.value.includes(d) ? `<div class="checkbox">
                    <div class="checklabel">
                        <div class="disc-border" checked></div>
                        <div class="disc" checked></div>
                    </div>
                    <div class="checkvalue">${d}</div>
                </div>` : `<div class="checkbox">
                    <div class="checklabel">
                        <div class="disc-border"></div>
                        <div class="disc"></div>
                    </div>
                    <div class="checkvalue">${d}</div>
                </div>`;
        });
        obj.float && this.float(div, obj.float);
        node && node.appendChild(div);
        div.querySelectorAll(".checkbox").forEach(d => {
            d.onclick = () => {
                obj.value.includes(d.innerText) ? obj.value.splice(obj.value.indexOf(d.innerText), 1) : obj.value.push(d.innerText);
                config[obj.key] = obj.value;
                obj.action && obj.action.call(div, obj.value);
            };
        });
        return div;
    }
}
const ui = new Ui();
API.showSetting = (key) => ui.draw(key);
// 注册开发者模式设置项
API.addSetting({
    key: "developer",
    sort: { key: "common", name: "通用", svg: '<svg viewBox="0 0 24 24"><g><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g></svg>' },
    label: "开发者模式",
    type: "switch",
    value: false,
    float: '开发者模式将暴露核心变量 <b>API</b> 到页面顶级对象 window，可以借此在控制台调试部分功能。',
    sub: '暴露 API 到 window',
    action: (value) => API.toast.warning(`开发者模式 ${value ? "开" : "关"}`, '<strong>该选项必须刷新才会生效！</strong>')
});
config.developer && (window.API = API);