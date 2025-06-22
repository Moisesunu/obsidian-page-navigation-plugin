// Plugin de Obsidian para navegación entre páginas de forma rápida y sencilla
// usando atajos de teclado que se pueden configurar en la pestaña de ajustes del plugin.
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface PluginSettings {
    // Aqui se pueden definir las configuraciones del plugin
    quickNavEnabled: boolean;
    quickNavKey: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
    quickNavEnabled: true,
    quickNavKey: 'Alt+S'
}

export default class PageNavigationPlugin extends Plugin {
    settings: PluginSettings;

    async onload() {
        await this.loadSettings();

		this.addCommand({
			id: 'navigate-to-next-page',
			name: 'Ir a la pagina siguiente',
			callback: async () => {
				const files = this.app.vault.getMarkdownFiles()
				    .sort((a, b) => a.path.localeCompare(b.path));
				const activeFile = this.app.workspace.getActiveFile();
				if (!activeFile) {
					new Notice('No hay un archivo activo para navegar.');
					return;
				}
				const currentIndex = files.findIndex(f => f.path === activeFile.path);
				if (currentIndex === -1) {
					new Notice('No se pudo encontrar la nota actual.');
					return;
				}
				const nextIndex = (currentIndex + 1) % files.length;
				const nextFile = files[nextIndex];

				await this.app.workspace.getLeaf().openFile(nextFile);
				new Notice(`Navegando a: ${nextFile.basename}`);
			}
		});

		this.addCommand({
			id: 'navigate-to-previous-page',
			name: 'Ir a la página anterior',
			callback: async () => {
				const files = this.app.vault.getMarkdownFiles()
				    .sort((a, b) => a.path.localeCompare(b.path));
				const activeFile = this.app.workspace.getActiveFile();
				if (!activeFile) {
					new Notice('No hay un archivo activo para navegar.');
					return;
				}
				const currentIndex = files.findIndex(f => f.path === activeFile.path);
				if (currentIndex === -1) {
					new Notice('No se pudo encontrar la nota actual.');
					return;
				}
				const previousIndex = (currentIndex - 1 + files.length) % files.length;
				const previousFile = files[previousIndex];

				await this.app.workspace.getLeaf().openFile(previousFile);
				new Notice(`Navegando a: ${previousFile.basename}`);
			}
		});
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}