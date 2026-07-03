import {
  defineConfig,
  prompt,
  render,
  copy,
  move,
  remove,
  execute,
} from '@reuters-graphics/bluprint';

interface Context {
  projectName: string;
}

export default defineConfig<Context>({
  name: {
    title: 'Test Bluprint (v1)',
    hint: 'E2E fixture for start/clone/preview',
  },
  // No `bluprint:` version constraint yet — a `^1.0.0` constraint would make
  // checkVersion abort against the current 0.6.x dev CLI. Add after 1.0 publish.
  files: ['**/*'],
  // Authoring-only files: keep them out of scaffolded projects.
  ignores: ['package.json', 'tsconfig.json', 'pnpm-lock.yaml', 'node_modules/**'],
  actions: [
    // Ask for the project name. In non-interactive mode (CI / `--ci`) this uses
    // `initialValue` unless overridden by `--input`, so the same bluprint works
    // both at a terminal and headless. render + copy read it via typed context.
    prompt({
      name: 'projectName',
      type: 'text',
      message: 'Project name?',
      initialValue: 'My Project',
    }),
    // render — mustache, in place.
    render({ files: ['README.md'] }),
    // copy — templated destination (slugified project name).
    copy(['templates/component.js', 'src/{{# slugify }}{{ projectName }}{{ /slugify }}.js']),
    // move — rename the template gitignore into a real dotfile.
    move([['gitignore', '.gitignore']]),
    // remove — drop the throwaway file and the now-consumed templates dir.
    // Runs AFTER copy, which reads templates/component.js.
    remove(['DELETE_ME.md', 'templates']),
    // execute — array form (no shell), with a spinner.
    execute(['git', 'init'], { silent: true }),
  ],
});
