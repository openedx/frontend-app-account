# For more details about the translation jobs, see https://github.com/edx/frontend-i18n/blob/master/docs/how_tos/i18n.rst

transifex_resource = frontend-app-account
langs = "ar,fr,es_419,zh_CN"

transifex_utils = ./src/i18n/i18n-concat.js
transifex_input = ./src/i18n/transifex_input.json
tx_url1 = https://www.transifex.com/api/2/project/edx-platform/resource/$(transifex_resource)/translation/en/strings/
tx_url2 = https://www.transifex.com/api/2/project/edx-platform/resource/$(transifex_resource)/source/

# this directory must match .babelrc
temp = ./babel-plugin-react-intl-temp

requirements:
	npm install
	rm -rf $(temp)

i18n.extract:
    # Pulling display strings from .jsx files into .json files...
	npm run-script i18n_extract

i18n.concat:
    # Gathering JSON messages into one file...
	$(transifex_utils) $(temp) $(transifex_input)

extract_translations: | requirements i18n.extract i18n.concat

detect_changed_source_translations:
    # Checking for changed translations...
	git diff --exit-code $(transifex_input)

validate-no-uncommitted-package-lock-changes:
    # Checking for package-lock.json changes...
	git diff --exit-code package-lock.json

# Push translations to Transifex.  Run make extract_translations first.
push_translations:
    # Pushing strings to Transifex...
	tx push -s
	# Fetching hashes from Transifex...
	./node_modules/reactifex/bash_scripts/get_hashed_strings.sh $(tx_url1)
    # Writing out comments to file...
	$(transifex_utils) $(temp) --comments
    # Pushing comments to Transifex...
	./node_modules/reactifex/bash_scripts/put_comments.sh $(tx_url2)

# Pull translations from Transifex
pull_translations:
	tx pull -f --mode reviewed --language=$(langs)
