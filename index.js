#!/usr/bin/env node
const request = require('request');
const cheerio = require('cheerio');
const colors = require('colors');
const word = process.argv[2];
const isCN = isChinese(word);
const url = isCN?`http://dict.youdao.com/w/${encodeURIComponent(word)}`:`http://dict.youdao.com/w/eng/${word}`;
let $ = null;
let result = '';

if(typeof word == 'undefined'){
    return  console.log('请大声说出你要查什么！！'.red);
}

request(url,(error,res,body)=>{
    result = parseHtml(body);
    if(error){ 
       return  console.log('出错啦...'.red)
    }
    if(result.length){
        console.log(result.green);
    }else{
        console.log('没有查到...'.red)
    }
});

function parseHtml(body){
    $ = cheerio.load(body);
    let txt ='';
    if(!isCN){
        txt = $('#phrsListTab .trans-container ul li').map(function(i,el){
            return getRawText(this);
        }).get().join('\n');
    }else{
        txt =$('#phrsListTab .trans-container ul .wordGroup').map(function(i,el){
            return getRawText($(this));
        }).get().join('\n');
    }
    return txt;
}
function getRawText(item){
    let children =$(item).children(),
        text = '';
    if(children.length){
        for(let i = 0,len = children.length;i<len;i++){
            let child = children[i];
            text += getRawText(child);
        }
        return text;
    }else{
        return $(item).text();      
    }
}

function isChinese(word){
    let reg = /[\u4e00-\u9fa5]/;
    return reg.test(word);
}
