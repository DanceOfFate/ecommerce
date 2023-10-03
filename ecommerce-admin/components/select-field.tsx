import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SelectFieldProps {
    label: string,
    control: any;
    name: string;
    disabled: boolean;
    placeholder: string;
    data: any[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    control,
    name,
    disabled,
    placeholder,
    data
}) => {
    return (
        <FormField 
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Select 
                            disabled={disabled}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue 
                                        defaultValue={field.value}
                                        placeholder={placeholder}
                                    />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {data?.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {
                                        item?.name 
                                        ? item.name 
                                        : item.label
                                        }
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                <FormMessage /> 
                </FormItem>
            )}
        />
    )    
}