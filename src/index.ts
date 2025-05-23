const inquirer = require("inquirer");
const consola = require("consola");

export enum MessageVariant {
	Success = "success",
	Error = "error",
	Info = "info",
}

export class Message {
	constructor(private content: string) {}

	public show(): void {
		console.log(this.content);
	}

	public capitalize(): void {
		this.content =
			this.content.charAt(0).toUpperCase() +
			this.content.slice(1).toLowerCase();
	}

	public toUpperCase(): void {
		this.content = this.content.toUpperCase();
	}

	public toLowerCase(): void {
		this.content = this.content.toLowerCase();
	}

	public static showColorized(variant: MessageVariant, text: string): void {
		switch (variant) {
			case MessageVariant.Success:
				consola.success(text);
				break;
			case MessageVariant.Error:
				consola.error(text);
				break;
			case MessageVariant.Info:
				consola.info(text);
				break;
		}
	}
}

interface User {
	name: string;
	age: number;
}

export class UsersData {
	private data: User[] = [];

	public showAll(): void {
		Message.showColorized(MessageVariant.Info, "Users data");
		if (this.data.length === 0) {
			console.log("No data...");
		} else {
			console.table(this.data);
		}
	}

	public add(user: User): void {
		if (
			typeof user.name === "string" &&
			user.name.length > 0 &&
			typeof user.age === "number" &&
			user.age > 0
		) {
			this.data.push(user);
			Message.showColorized(
				MessageVariant.Success,
				"User has been successfully added!"
			);
		} else {
			Message.showColorized(MessageVariant.Error, "Wrong data!");
		}
	}

	public remove(name: string): void {
		const index = this.data.findIndex((u) => u.name === name);
		if (index >= 0) {
			this.data.splice(index, 1);
			Message.showColorized(MessageVariant.Success, "User deleted!");
		} else {
			Message.showColorized(MessageVariant.Error, "User not found...");
		}
	}
}

const users = new UsersData();

console.log("\n");
console.info("ℹ Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list   – show all users");
console.log("add    – add new user to the list");
console.log("remove – remove user from the list");
console.log("edit   – edit existing user");
console.log("quit   – quit the app");
console.log("\n");

enum Action {
	List = "list",
	Add = "add",
	Remove = "remove",
	Edit = "edit",
	Quit = "quit",
}

type InquirerAnswers = {
	action: Action;
};

const startApp = (): void => {
	inquirer
		.prompt([{ name: "action", type: "input", message: "How can I help you?" }])
		.then(async (raw: any) => {
			const answers = raw as InquirerAnswers;
			switch (answers.action) {
				case Action.List:
					users.showAll();
					break;
				case Action.Add: {
					const rawUser = await inquirer.prompt([
						{ name: "name", type: "input", message: "Enter name" },
						{ name: "age", type: "number", message: "Enter age" },
					]);
					users.add(rawUser as User);
					break;
				}
				case Action.Remove: {
					const rawName = await inquirer.prompt([
						{ name: "name", type: "input", message: "Enter name to remove" },
					]);
					users.remove((rawName as { name: string }).name);
					break;
				}
				case Action.Edit: {
					const select = await inquirer.prompt([
						{ name: "oldName", type: "input", message: "Enter name to edit" },
					]);
					const { oldName } = select as { oldName: string };
					const updated = await inquirer.prompt([
						{ name: "name", type: "input", message: "New name" },
						{ name: "age", type: "number", message: "New age" },
					]);
					users.remove(oldName);
					users.add(updated as User);
					break;
				}
				case Action.Quit:
					Message.showColorized(MessageVariant.Info, "Bye bye!");
					return;
				default:
					Message.showColorized(MessageVariant.Error, "Command not found");
			}
			startApp();
		});
};

startApp();
