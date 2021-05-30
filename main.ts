import {Plugin, MarkdownView} from 'obsidian';
import SuperchargedLinksSettingTab from "src/settings/SuperchargedLinksSettingTab"
import {updateElLinks, updateVisibleLinks} from "src/linkAttributes/linkAttributes"
import {SuperchargedLinksSettings, DEFAULT_SETTINGS} from "src/settings/SuperchargedLinksSettings"
import Field from 'src/Field';
import linkContextMenu from "src/options/linkContextMenu"
import NoteFieldsCommandsModal from "src/options/NoteFieldsCommandsModal"

export default class SuperchargedLinks extends Plugin {
	settings: SuperchargedLinksSettings;
	initialProperties: Array<Field> = []
	settingTab: SuperchargedLinksSettingTab

	async onload():Promise <void> {
		console.log('Supercharged links loaded');
		await this.loadSettings();

		this.settings.presetFields.forEach(prop => {
			const property = new Field()
			Object.assign(property, prop)
			this.initialProperties.push(property)
		}) 
		this.addSettingTab(new SuperchargedLinksSettingTab(this.app, this));
		this.registerMarkdownPostProcessor((el, ctx) => {
			updateElLinks(this.app, this.settings, el, ctx)
		});
		this.app.metadataCache.on('changed', (_file) => {
			updateVisibleLinks(this.app, this.settings)
		});

		this.addCommand({
			id: "field_options",
			name: "field options",
			hotkeys: [
				{
					modifiers: ["Alt"],
					key: 'O',
				},
			],
			callback: () => {
				const leaf = this.app.workspace.activeLeaf
				if(leaf.view instanceof MarkdownView && leaf.view.file){
					const fieldsOptionsModal = new NoteFieldsCommandsModal(this.app, this, leaf.view.file)
					fieldsOptionsModal.open()
				}
			},
		});

		new linkContextMenu(this)
	}

	onunload() {
		console.log('Supercharged links unloaded');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		this.settings.presetFields = this.initialProperties
		await this.saveData(this.settings);
	}
}