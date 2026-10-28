(function () {
	const { metro, commands } = window.unbound;

	const ID = 'user.account-switcher';

	// Metro module ids are specific to the Unbound loader build this was written against
	const MODULE_ACCOUNT_SHEET = 17862;
	const MODULE_MANAGE_ACCOUNTS = 17867;
	const MODULE_SWITCH_CONSTANTS = 13309;

	const reply = (content) => ({ ephemeral: true, content });

	function exportsOf(id) {
		const m = window.modules.get(id);
		const ex = m && m.isInitialized && m.publicModule && m.publicModule.exports;
		if (!ex) throw new Error('module ' + id + ' not found - Discord build changed');
		return ex;
	}

	function multiStore() {
		const auth = metro.findByProps('getToken');
		const A = auth && auth.default && typeof auth.getToken !== 'function' ? auth.default : auth;
		const S = A.constructor.getAll().find((x) => x.getName() === 'MultiAccountStore');
		if (!S) throw new Error('MultiAccountStore not found');
		return S;
	}

	function setEnabled(on) {
		const S = multiStore();
		if (on) S.getCanUseMultiAccountMobile = () => true;
		else delete S.getCanUseMultiAccountMobile;
		S.emitChange();
	}

	const Cmds = commands.createCommands(ID);
	Cmds.register({
		acct: {
			description: 'Discord multi-account helpers',
			subcommands: {
				manage: {
					description: 'Open the Manage Accounts modal',
					execute: () => {
						setEnabled(true);
						const fn = exportsOf(MODULE_MANAGE_ACCOUNTS).default;
						try {
							fn();
						} catch (e) {
							fn(exportsOf(MODULE_SWITCH_CONSTANTS).MultiAccountSwitchLocation.MANAGE_ACCOUNTS_MODAL);
						}
						return reply('Opened Manage Accounts');
					},
				},
				sheet: {
					description: 'Open the account action sheet',
					execute: () => {
						setEnabled(true);
						exportsOf(MODULE_ACCOUNT_SHEET).showYouAccountActionSheet();
						return reply('Opened account action sheet');
					},
				},
			},
		},
	});

	return {
		start() {
			try { setEnabled(true); } catch (e) {}
		},
		stop() {
			try { setEnabled(false); } catch (e) {}
			Cmds.unregisterAll();
		},
	};
})()
