export default function getFormattedDate(dateString: string): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(dateString))
}