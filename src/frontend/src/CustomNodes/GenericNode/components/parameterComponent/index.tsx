import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import Tooltip from "../../../../components/TooltipComponent";
import { classNames, isValidConnection } from "../../../../utils";
import { useContext, useEffect, useRef, useState } from "react";
import InputComponent from "../../../../components/inputComponent";
import ToggleComponent from "../../../../components/toggleComponent";
import InputListComponent from "../../../../components/inputListComponent";
import TextAreaComponent from "../../../../components/textAreaComponent";
import { typesContext } from "../../../../contexts/typesContext";
import { ParameterComponentType } from "../../../../types/components";
import FloatComponent from "../../../../components/floatComponent";
import Dropdown from "../../../../components/dropdownComponent";

export default function ParameterComponent({
	left,
	id,
	data,
	tooltipTitle,
	title,
	color,
	type,
	name = "",
	required = false,
}: ParameterComponentType) {
	const ref = useRef(null);
	const updateNodeInternals = useUpdateNodeInternals();
	const [position, setPosition] = useState(0);
	useEffect(() => {
		if (ref.current && ref.current.offsetTop && ref.current.clientHeight) {
			setPosition(ref.current.offsetTop + ref.current.clientHeight / 2);
			updateNodeInternals(data.id);
		}
	}, [data.id, ref, updateNodeInternals]);

	useEffect(() => {
		updateNodeInternals(data.id);
	}, [data.id, position, updateNodeInternals]);

	const [enabled, setEnabled] = useState(
		data.node.template[name]?.value ?? false
	);
	console.log(data.node.template[name]);
	const { reactFlowInstance } = useContext(typesContext);
	let disabled =
		reactFlowInstance?.getEdges().some((e) => e.targetHandle === id) ?? false;

	return (
		<div
			ref={ref}
			className="w-full flex flex-wrap justify-between items-center bg-gray-50 dark:bg-gray-800 dark:text-white mt-1 px-5 py-2"
		>
			<>
				<div className="text-sm truncate">
					{title}
					<span className="text-red-600">{required ? " *" : ""}</span>
				</div>
				{left && (type === "str" || type === "bool" || type === "float") ? (
					<></>
				) : (
					<Tooltip title={tooltipTitle + (required ? " (required)" : "")}>
						<Handle
							type={left ? "target" : "source"}
							position={left ? Position.Left : Position.Right}
							id={id}
							isValidConnection={(connection) =>
								isValidConnection(connection, reactFlowInstance)
							}
							className={classNames(
								left ? "-ml-0.5 " : "-mr-0.5 ",
								"w-3 h-3 rounded-full border-2 bg-white dark:bg-gray-800"
							)}
							style={{
								borderColor: color,
								top: position,
							}}
						></Handle>
					</Tooltip>
				)}

				{left === true &&
				type === "str" &&
				!data.node.template[name].options ? (
					<div className="mt-2 w-full">
						{data.node.template[name].list ? (
							<InputListComponent
								disabled={disabled}
								value={
									!data.node.template[name].value ||
									data.node.template[name].value === ""
										? [""]
										: data.node.template[name].value
								}
								onChange={(t: string[]) => {
									data.node.template[name].value = t;
								}}
							/>
						) : data.node.template[name].multiline ? (
							<TextAreaComponent
								disabled={disabled}
								value={data.node.template[name].value ?? ""}
								onChange={(t: string) => {
									data.node.template[name].value = t;
								}}
							/>
						) : (
							<InputComponent
								disabled={disabled}
								password={data.node.template[name].password ?? true}
								value={data.node.template[name].value ?? ""}
								onChange={(t) => {
									data.node.template[name].value = t;
								}}
							/>
						)}
					</div>
				) : left === true && type === "bool" ? (
					<div className="mt-2">
						<ToggleComponent
							disabled={disabled}
							enabled={enabled}
							setEnabled={(t) => {
								data.node.template[name].value = t;
								setEnabled(t);
							}}
						/>
					</div>
				) : left === true && type === "float" ? (
					<FloatComponent
						disabled={disabled}
						value={data.node.template[name].value ?? ""}
						onChange={(t) => {
							data.node.template[name].value = t;
						}}
					/>
				) : left === true &&
				  type === "str" &&
				  data.node.template[name].options ? (
					<Dropdown
						options={data.node.template[name].options}
						onSelect={(newValue) => data.node.template[name].value=newValue}
						value={data.node.template[name].value??"chose an option"}
					></Dropdown>
				) : (
					<></>
				)}
			</>
		</div>
	);
}
