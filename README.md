## Initial setup

1. Run `npm init -y` command
2. Run `npm i -D @types/express @types/cors @types/cookie-parser @types/node nodemon typescript ts-node` command
3. Run `npm i express cors cookie-parser` command
4. Create `tsconfig.json` file with this configuration

```
{
    "compilerOptions": {
        "target": "es2016",
		"experimentalDecorators": true,
		"emitDecoratorMetadata": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"skipLibCheck": true,
		"moduleResolution": "NodeNext",
		"module": "NodeNext"
    }
}

```

4. Update package.json

```
  "scripts": {
    "dev": "nodemon src/index.ts",
  },
```

## Database setup

1. Run `npm i typeorm reflect-metadata mysql2` command
2. Create `data-source.ts` file

```
import 'reflect-metadata';
import {DataSource} from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'Darrennienaber01',
	database: 'refresh_token',
	synchronize: true,
	logging: false,
	entities: ['src/entity/**/*{.ts,.js}'],
	migrations: ['src/migration/**/*{.ts,.js}'],
	subscribers: [],
});
```
