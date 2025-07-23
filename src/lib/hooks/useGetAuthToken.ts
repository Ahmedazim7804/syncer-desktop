
export default function useGetAuthToken() : string | null {
    return localStorage.getItem("token")
}