import eslint from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueEslintParser from 'vue-eslint-parser'

export default [
    eslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['**/*.js', '**/*.vue'],
        languageOptions: {
            parser: vueEslintParser,
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly',
                console: 'readonly',
                fetch: 'readonly'
            }
        },
        plugins: {
            vue: pluginVue,
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'indent': 'off',                    //odio el tab de 2
            'vue/html-indent': 'off',           //odio el tab de 2
            'vue/singleline-html-element-content-newline': 'off',
            'vue/max-attributes-per-line': 'off',
            'vue/no-multi-spaces': 'off',
            'vue/html-self-closing': 'off',
            'vue/attributes-order': 'off',
            'vue/html-closing-bracket-spacing': 'off',
            //tengo muchos ordenes de componentes y no quiero warnings por eso
            'vue/order-in-components': 'off',
            // importante
            'no-unused-vars': 'error',
        },
    },
]