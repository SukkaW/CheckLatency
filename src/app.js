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
    let cloud = this.getAttribute('id');
    var json = serverJson[cloud];
    Object.keys(json.region).forEach((value, index) => {
        let data = [];
        data.region = json.region[value]
        console.log(data)
    });

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

    async function asyncPool(poolLimit, array, iteratorFn) {
        const ret = [];
        const executing = [];
        for (const item of array) {
            const p = Promise.resolve().then(() => iteratorFn(item, array));
            ret.push(p);
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= poolLimit) {
                await Promise.race(executing);
            }
        }
        return Promise.all(ret);
    }

    async function asyncPool(poolLimit, array, iteratorFn) {
        const ret = [];
        const executing = [];
        for (const item of array) {
            const p = Promise.resolve().then(() => iteratorFn(item, array));
            ret.push(p);
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= poolLimit) {
                await Promise.race(executing);
            }
        }
        return Promise.all(ret);
    }

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        })
    }

    async function test_main(data) {
        await console.log(this);
        await test_dns(data);
    }

    async function test_dns(data) {
        data.status = 'preloading dns ...'

        let start = (new Date()).getTime();

        try {
            let random = Math.random()
            await timeoutPromise(loadImage(`${data.url}/sukka-checklatency-getdns?${random}`), 6000)
        } catch (error) {
            console.error(error);
        }

        let end = (new Date()).getTime();

        if (end - start > 6000) {
            data.current = 0
            data.status = 'timeout'
            data.score = 0
            data.timeout = end - start
        } else {
            data.current = 0
            data.status = 'dns preload finished'
        }
    }

    async function test_main(data) {
        data.status = 'start testing ...'

        let start = (new Date()).getTime();

        try {
            let random = Math.random()
            await timeoutPromise(loadImage(`${data.url}/sukka-checklatency-getdns?${random}`), 6000)
        } catch (error) {
            console.error(error);
        }

        let end = (new Date()).getTime();

        if (end - start > 10000) {
            data.current = 0
            data.status = 'timeout'
            data.score = 0
            data.timeout = end - start
        } else {
            data.current = data.current + 1
            data.status = 'testing ...'
            data.timeout = (end - start + data.timeout) / data.current
        }
    }
}


