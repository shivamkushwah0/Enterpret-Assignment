export function checkEmptyOptions(options: any) {
    var a = true;
    options.map((option: any) => {
        a = option.field && option.condition && option.criteria 
    })
    return a
}