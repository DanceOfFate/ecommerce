import { 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel 
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

interface CheckboxFieldProps {
    control: any,
    name: string,
    label: string,
    description: string
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
    control,
    name,
    label,
    description
}) => {
            return (
                    <FormField 
                        control={control}
                        name={name}
                        render={({ field }) => (
                            <FormItem 
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                    {label}
                                </FormLabel>
                                <FormDescription>
                                    {description}
                                </FormDescription>
                              </div>
                            </FormItem>
                        )}
                    />
    )
}