/*
 * Fetch helper
 */
get = (url) =>
    fetch(url, {
        method: 'GET'
    }).then(resp => Promise.all([resp.ok, resp.status, resp.json()])
    ).then(([ok, status, json]) => {
        if (ok) {
            return json;
        } else {
            throw new Error(JSON.stringify(json.error));
        }
    })/*.catch(error => {
        throw error;
    })*/;

/*
 Promise Timeout Helper
*/

function delayPromise(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function timeoutPromise(promise, ms) {
    var timeout = delayPromise(ms).then(function () {
        throw new Error('Operation timed out after ' + ms + ' ms');
    });
    return Promise.race([promise, timeout]);
}

function renderCard() {
    get("server.json").then(json => {
        window.serverJson = json;
        Object.keys(json).forEach((value, index) => {
            var html = '<h2 id="cloud-' + value + '" class="h4 sk-text-dark sk-mt-7 sk-pt-3 sk-mb-2 sk-text-bold">' + json[value].name + '</h2>';
            html += '<div class="columns">';
            let region = json[value].region;
            Object.keys(region).forEach((value, index) => {
                region[value].url = region[value].link.replace('http://', '').replace('https://', '');
                region[value].id = value;
                if (typeof (region[value].dl) === "undefined") {
                    region[value].dl = '';
                }
                html += baidu.template('cloud-item-tpl', region[value]);
            });
            html += '</div>';
            html += '<button id="' + value + '" class="btn btn-primary sk-mt-3 check-latency-button">开始测试</button>';
            document.getElementById('app').insertAdjacentHTML('beforeend', html);
        });
    }).then(function () {
        var $btn = document.getElementsByClassName('check-latency-button');
        for (var i = 0; i < $btn.length; i += 1) {
            $btn[i].addEventListener('click', checkLatency);
        };
    });
}

renderCard();

function checkLatency() {
    var data = [];

    function getDNS(url) {
        let img = new Image;
        img.src = url + '/sukka-checklatency?' + Math.random();
        img.dt = new Date();
    }

    function getMain(url, data) {
        data.start = new Date().getTime();
        let img = new Image;
        img.onload = () => {
            data.finish = new Date().getTime();
            console.log(data)
        }
        img.onerror = () => {
            data.finish = new Date().getTime();
            console.log(data)
        }
        img.src = url + '/sukka-checklatency?' + Math.random();
        img.dt = new Date();
    }

    var json = serverJson[this.getAttribute('id')];
    let pool = Object.keys(json.region).length;
    Object.keys(json.region).forEach((value, index) => {
        data.region = value;
        data.link = json.region[value].link
        getDNS(data.link);
        getMain(data.link, data);
    });
    console.log(data);
}


