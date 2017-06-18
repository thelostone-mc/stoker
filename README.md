# stoker
Basically your stock broker

### Server & Client
- Express
- React
- MVC approach

### Needed tools
- node
- npm
- gulp
- yarn
- mongo (enable oplog)
- Hbase / Cassandra (Yet to be added)

### Setup
- Ensure mongo replSet is up (`mongod --replSet rs01` )
- Run express server `./stoker` using `gulp`. Server runs ar port 3001
- Navigate to `./stoker/stoker-client` and run `yarn start`

### Contributing
The commit message should describe what changed and why.

The first line should:
 - contain a short description of the change
 - be 50 characters or less
 - be entirely in lowercase with the exception of proper nouns, acronyms, and the words that refer to code, like function/variable names
 - be prefixed with the name of the changed subsystem and start with an imperative verb. Check the output of git log --oneline files/you/changed to find out what subsystems your changes touch.
- Keep the second line blank.
- Wrap all other lines at 72 columns.
- If your patch fixes an open issue, you can add a reference to it at the end of the log. Use the Fixes: prefix and the full issue URL. For other references use Refs:

**Sample Commit**
```
subsystem: explain the commit in one line

Body of commit message is a few lines of text, explaining things
in more detail, possibly giving some background about the issue
being fixed, etc.

The body of the commit message can be several paragraphs, and
please do proper word-wrap and keep columns shorter than about
72 characters or so. That way, `git log` will show things
nicely even when it is indented.

Fixes: https://github.com/adityaanandmc/issues/2
Refs: http://eslint.org/docs/rules/space-in-parens.html
```

#### Collaborators
- [Shroff Amrith Nayak](https://github.com/amrith92)
- [Aditya Anand MC](https://github.com/adityaanandmc)
