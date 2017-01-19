const _ = require('lodash');
const fs = require('fs');
const translateByGoogle = require('google-translate-api');
const translateByBaidu = require('./baidu-translate.js');
const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('demo.txt')
});

var bookLines = [];
var writeFile = function(bookLines, src) {
    console.log('translate done....');
    fs.writeFile(src, _.map(bookLines, item => 'original:\n' + item.en + '\n\ngoogle:\n' + item.zhByGoogle + '\n\nbaidu:\n' + item.zhByBaidu).join('\n\n'));
    console.log('done....');
}


lineReader.on('line', function(line) {
    bookLines.push({
        en: line,
        zhByGoogle: '',
        zhByBaidu: ''
    });
});

console.log('read all lines....');

lineReader.on('pause', function(line) {
    console.log('--------------------');
    _.forEach(bookLines, (item, index) => {
        if (index < 50) {
            translateByGoogle(item.en, { to: 'zh-CN' }).then(res => {
                console.log(res.text);
                bookLines[index].zhByGoogle = res.text;
                console.log('google:' + index + '/' + bookLines.length);
            }).catch(err => {
                console.error(err);
            });

            translateByBaidu({
                from: 'en',
                to: 'zh',
                query: item.en
            }, function(result) {
                console.log(result);
                bookLines[index].zhByBaidu = result;
                console.log('baidu:' + index + '/' + bookLines.length);
            });
        }
    })

    console.log('--------------------');
    setTimeout(function() {
        writeFile(bookLines, 'result.txt');
    }, 10000);
});
