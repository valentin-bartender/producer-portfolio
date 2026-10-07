const { webkit } = require('playwright');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], {stdio:'ignore'});
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
  let browser;
  try {
    for(let i=0;i<30;i++){try{const r=await fetch('http://127.0.0.1:4173/');if(r.ok)break;}catch{}await pause(200);}
    browser = await webkit.launch();
    fs.mkdirSync('ipad-checks',{recursive:true});
    const results=[];
    for(const viewport of [{width:1024,height:768},{width:1194,height:834},{width:768,height:1024}]){
      const context=await browser.newContext({viewport,isMobile:true,hasTouch:true,deviceScaleFactor:2});
      const page=await context.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const failed=[];
      page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4173/') && r.status()>=400)failed.push(r.status()+' '+r.url());});
      await page.goto('http://127.0.0.1:4173/cinematic-stories/',{waitUntil:'load'});
      assert.equal(await page.locator('.slide').count(),7);
      await page.locator('.analog-hero img').evaluate(img=>img.decode());
      const hero=await page.locator('.analog-hero img').boundingBox();
      assert(hero.width>200 && hero.height>250,'Hero photo must have visible dimensions');
      await page.screenshot({path:'ipad-checks/hero-'+viewport.width+'x'+viewport.height+'.png'});
      const go=async n=>{
        await page.locator('.chapters button').nth(n).click();
        await page.waitForFunction(n=>document.querySelectorAll('.chapters button')[n].getAttribute('aria-current')==='step',n);
        await page.waitForFunction(n=>Math.abs(document.querySelector('.deck').scrollLeft-n*document.querySelector('.deck').clientWidth)<2,n);
        assert.equal(await page.locator('.slide').nth(n).getAttribute('inert'),null);
      };
      const decode=async selector=>{
        for(const img of await page.locator(selector).all())await img.evaluate(img=>{img.loading='eager';return img.decode();});
      };
      await go(1);
      await decode('.illustrated-story img');
      assert.equal(await page.locator('.story-diagram').count(),3);
      await page.screenshot({path:'ipad-checks/story-'+viewport.width+'x'+viewport.height+'.png'});
      await go(2);
      assert.equal(await page.locator('.work-card').count(),3);
      assert.equal(await page.locator('.placeholder-label').count(),3);
      await go(3);
      for(let n=0;n<6;n++){
        await page.locator('[data-brand="'+n+'"]').click();
        assert.equal(await page.locator('[data-brand="'+n+'"]').getAttribute('aria-selected'),'true');
        assert.equal(await page.locator('[role="tabpanel"]:visible').count(),1);
        await decode('#brand-panel-'+n+' img');
        if(n<2)await page.screenshot({path:'ipad-checks/'+(n===0?'styles':'moods')+'-'+viewport.width+'x'+viewport.height+'.png'});
      }
      await page.locator('#show-credits').click();
      assert.equal(await page.locator('#photo-credits').evaluate(d=>d.open),true);
      await page.locator('#close-credits').click();
      for(const n of [4,5,6,0])await go(n);
      await decode('.production-photo img');
      const layout=await page.evaluate(()=>({
        viewport:innerWidth,
        bodyWidth:document.body.scrollWidth,
        navigationBottom:document.querySelector('.nav').getBoundingClientRect().bottom,
        height:innerHeight
      }));
      assert(layout.bodyWidth<=layout.viewport+2,'No horizontal body overflow');
      assert(layout.navigationBottom<=layout.height+2,'Navigation remains on screen');
      assert.equal(errors.length,0,'No JavaScript errors: '+errors.join(', '));
      assert.equal(failed.length,0,'No missing local assets: '+failed.join(', '));
      results.push({viewport,hero,layout,jpegDecoding:'passed',chapters:'7 passed',brandPanels:'6 passed',credits:'passed',errors,failed});
      await context.close();
    }
    fs.writeFileSync('ipad-checks/results.json',JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  } finally {
    if(browser)await browser.close();
    server.kill();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
