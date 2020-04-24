import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/dart/dart';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/django/django';
import 'codemirror/mode/dockerfile/dockerfile';
import 'codemirror/mode/go/go';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/nginx/nginx';
import 'codemirror/mode/php/php';
import 'codemirror/mode/python/python';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/pascal/pascal';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/stylus/stylus';
import 'codemirror/mode/vue/vue';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/haskell/haskell';

export enum CodeLanguages {
    'CLike' = 'clike',
    'CSS' = 'css',
    'Dart' = 'dart',
    'Django' = 'django',
    'Dockerfile' = 'dockerfile',
    'Go' = 'go',
    'Markdown' = 'markdown',
    'Nginx' = 'nginx',
    'Python' = 'python',
    'PHP' = 'php',
    'Shell' = 'shell',
    'SQL' = 'sql',
    'Swift' = 'swift',
    'HTML' = 'htmlmixed',
    'JavaScript' = 'javascript',
    'JSX' = 'jsx',
    'Pascal' = 'pascal',
    'Sass' = 'sass',
    'Stylus' = 'stylus',
    'Vue' = 'vue',
    'YAML' = 'yaml',
    'Haskell' = 'haskell'
}

export const DEFAULT_LANGUAGE = {
    name: 'JavaScript',
    value: CodeLanguages.JavaScript
};

export const CODE_BLOCK_LANGUAGES = [
    { name: 'Plain Text', value: '' },
    { name: 'C-lick', value: CodeLanguages.CLike },
    DEFAULT_LANGUAGE,
    { name: 'CSS', value: CodeLanguages.CSS },
    { name: 'JSX', value: CodeLanguages.JSX },
    { name: 'Dart', value: CodeLanguages.Dart },
    { name: 'Django', value: CodeLanguages.Django },
    { name: 'Dockerfile', value: CodeLanguages.Dockerfile },
    { name: 'Go', value: CodeLanguages.Go },
    { name: 'Markdown', value: CodeLanguages.Markdown },
    { name: 'Nginx', value: CodeLanguages.Nginx },
    { name: 'PHP', value: CodeLanguages.PHP },
    { name: 'Python', value: CodeLanguages.Python },
    { name: 'Shell', value: CodeLanguages.Shell },
    { name: 'SQL', value: CodeLanguages.SQL },
    { name: 'Swift', value: CodeLanguages.Swift },
    { name: 'HTML', value: CodeLanguages.HTML },
    { name: 'Pascal', value: CodeLanguages.Pascal },
    { name: 'Sass', value: CodeLanguages.Sass },
    { name: 'Stylus', value: CodeLanguages.Stylus },
    { name: 'Vue', value: CodeLanguages.Vue },
    { name: 'YAML', value: CodeLanguages.YAML },
    { name: 'Haskell', value: CodeLanguages.Haskell }
];
