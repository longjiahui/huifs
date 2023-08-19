import { program } from 'commander'

program.command('say').action(() => console.debug('hello world'))

program.parse(process.argv)
