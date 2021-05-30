import {TFile} from "obsidian"
import SuperchargedLinks from "main"
import OptionsList from "src/options/OptionsList"

class linkContextMenu {
    plugin: SuperchargedLinks
	file: TFile
	optionsList: OptionsList

    constructor(plugin: SuperchargedLinks){
        this.plugin = plugin
        this.createContextMenu()
    }

	createContextMenu(): void{
		this.plugin.registerEvent(
            this.plugin.app.workspace.on('file-menu', (menu, abstractFile, source) => {
                if(this.plugin.settings.displayFieldsInContextMenu && (
					source === "link-context-menu" || 
					source === "calendar-context-menu" || 
					source === 'pane-more-options' ||
					source === 'file-explorer-context-menu')){
					const files = this.plugin.app.vault.getMarkdownFiles().filter(mdFile => mdFile.path == abstractFile.path)
					if(files.length > 0){
						const file = files[0]
						this.file = file
						this.optionsList = new OptionsList(this.plugin, this.file, menu)
						this.optionsList.createExtraOptionList()
					}
				}
            })
		);
	}
}

export default linkContextMenu