/**
 * @file 后台运行配置
 * @author littlewin<littlewin.wang@gmail.com>
 */

import { argv } from 'yargs';
import { packageJson } from '@app/transforms/module.transform';

// 项目基本配置
export const APP = {
  ROOT_PATH: __dirname,
  LIMIT: 16,
  PORT: 8090,
  ENVIRONMENT: process.env.NODE_ENV,
};

export const AUTH = {
  expiresIn: argv.auth_expires_in || '1h',
  params: argv.auth_params || {
    username: 'admin',
    password: 'r00tme',
  },
  jwtTokenSecret: argv.auth_key || 'littlewin',
};

export const EMAIL = {
  account: argv.email_account || 'your email address',
  password: argv.email_password || 'your email password',
};

export const GITHUB = {
  account: 'littlewin-wang',
};

export const AKISMET = {
  key: argv.akismet_key || 'your akismet Key',
  blog: argv.akismet_blog || 'your akismet blog site',
};

export const BAIDU = {
  site: argv.baidu_site || 'your baidu site domain',
  token: argv.baidu_token || 'your baidu seo push token',
};

export const QCLOUD = {
  AppId: argv.qcloud_app_id || 'your qcloud app id',
  SecretId: argv.qcloud_secret_id || 'your qcloud secret id',
  SecretKey: argv.qcloud_secret_key || 'your qcloud secret key',
  Region: argv.qcloud_region || 'your qcloud region',
  Bucket: argv.qcloud_bucket || 'your qcloud bucket',
  prefixURL: argv.qcloud_prefix_url || 'your qcloud prefix url',
};

export const MONGODB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/littlewin-dev`,
  username: argv.db_username || 'DB_admin',
  password: argv.db_password || 'DB_r00tme',
};

export const REDIS = {
  host: argv.redis_host || 'localhost',
  port: argv.redis_port || 6379,
  ttl: null,
  defaultCacheTTL: 60 * 60 * 24,
};

export const INFO = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  author: packageJson.author,
  repository: packageJson.repository.url,
  issues: packageJson.bugs.url,
  powered: ['Node.js', 'Nestjs', 'Express', 'MongoDB', 'Nginx'],
};
