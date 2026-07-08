<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Karir Sebaya') }}</title>

        @php
            $favicon = \App\Models\Setting::where('key', 'favicon')->value('value') ?? '/favicon.ico';
        @endphp
        <link rel="icon" href="{{ $favicon }}">

        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        
        <!-- Phosphor Icons -->
        <script src="https://unpkg.com/@phosphor-icons/web"></script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased text-gray-800 overflow-x-hidden selection:bg-brand-accent selection:text-white">
        @inertia
    </body>
</html>
