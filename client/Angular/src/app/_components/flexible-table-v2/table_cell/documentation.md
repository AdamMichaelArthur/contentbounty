Options
-------

Elements:
	Checkbox
	Icon
	Img
	Button
	Display Text
	Text Input
	Dropdown

Functionality
	Receive Drop Items
	Allow Drag and Drop
	Menu Items
	Drop Receive

Options: {
	datasource: String,
	scope: {
		"all" || "account" || "user"
	},
	header: {
		display: Boolean,
		pagination: Boolean,
		search: Boolean,
		file_upload: Boolean,
		bulk_options: {
			allowSelectVisible: Boolean,
			allowSelectAll: Boolean,
			allowDeleteVisible: Boolean,
			allowDeleteAll: Boolean
			buttons:	[<
							{
								"button_name":String,
								"button_route":String
							}
						>]
		}
	},
	footer: {
		display: Boolean,
		pages: Boolean
	},
	row_options: {
		allowSelectRow: Boolean,
		allowCheckRow: Boolean,
		allowDragRow: Boolean,
		allowDeleteRow: Boolean,
		allowCloneRow: Boolean,
		variableRowHeight: Boolean
	},
	columns_options: {
		displayHeaders: Boolean
		allowWidthResize: Boolean,
		variableColumnWidth: Boolean,
		allowDragRow: Boolean,
		allowSelectRow: Boolean
	},
	columns: {
		columnDisplayOrder: [<String>],
		hideColumnDefaultElement: [<String>],
		icons: [
				<
					{
						material_icon_name: String,
						tooltip_text: String,
						menu_on_click: Boolean,
						// Need to figure out menu on click options
					}
				>
				],
		buttons: [<String>],
		hyperlinks: Boolean, // If text contains a link, it becomes a clickable link
		internal_link: Boolean, // Makes any plain text into a view/route link

	}
	


}