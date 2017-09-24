let oss = require('ali-oss');
let co = require('co');
const globby = require('globby');
const path = require('path');
const fs = require('fs');


module.exports = function (opts) {

  opts.ossPath = opts.ossPath || '/';
  opts.target = opts.target || './build';
  const files = globby.sync(`${opts.target}/**/*.*`);
  
  let client = oss({
    accessKeyId: opts.accessKeyId,
    accessKeySecret: opts.accessKeySecret,
    bucket: opts.bucket,
    region: opts.region
  });

  return async function (next) {
    const self = this;

    //读取 json 文件
    let readJson = async (file) => {
      if (!fs.existsSync(file)) return {};
      let text = await self.utils.readFile(file);
      return JSON.parse(text);
    };

    let pkgFile = `${self.cwd}/package.json`;
    let pkg = await readJson(pkgFile);
    
    self.console.log('Begin upload to aliyun oss');
    self.console.log(`assets version is ${pkg.version} \n`);

    await Promise.all(files.map(async function(file){
      const replacePath = file.replace(opts.target, '');
      const ossPath = path.join( opts.ossPath, pkg.version, replacePath);
      const fileBuffer = await self.utils.readFile(file);
      const uploadRes = await co(client.put(ossPath, fileBuffer));
      if(uploadRes.res.status == 200){
        self.console.info(`[success] ${replacePath}`);
      }
      return uploadRes;
    }));

    self.console.log('All files upload success \n');

    next();

  };

};