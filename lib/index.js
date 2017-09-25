const oss = require('ali-oss');
const co = require('co');
const path = require('path');

module.exports = function (opts) {

  opts.ossPath = opts.ossPath || '/';
  opts.target = opts.target || './build';
  
  let client = oss({
    accessKeyId: opts.accessKeyId,
    accessKeySecret: opts.accessKeySecret,
    bucket: opts.bucket,
    region: opts.region
  });

  return async function (next) {
    const self = this;

    const files = await this.utils.files(`${opts.target}/**/*.*`);
    const projectVersion = this.project.version;
    
    self.console.log('Begin upload to aliyun oss');
    self.console.log(`Publish version is ${projectVersion} \n`);

    await Promise.all(files.map(async function(file){
      const replacePath = file.replace(opts.target, '');
      const ossPath = path.join( opts.ossPath, projectVersion, replacePath);
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