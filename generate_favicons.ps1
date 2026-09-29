Add-Type -AssemblyName System.Drawing

function Draw-Favicon([int]$size, [string]$outputPath, [bool]$isIco) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $scale = [float]($size / 512.0)

    # 1. Base Squircle - Deep Burgundy Velvet Gradient
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
        (New-Object System.Drawing.PointF 0, 0),
        (New-Object System.Drawing.PointF $size, $size),
        [System.Drawing.Color]::FromArgb(255, 52, 12, 22),
        [System.Drawing.Color]::FromArgb(255, 18, 3, 7)
    )

    $radius = [float](120.0 * $scale)
    $d = $radius * 2.0
    $sqPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $rect = New-Object System.Drawing.RectangleF ([float](14.0 * $scale)), ([float](14.0 * $scale)), ([float](484.0 * $scale)), ([float](484.0 * $scale))
    
    $sqPath.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
    $sqPath.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
    $sqPath.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
    $sqPath.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
    $sqPath.CloseFigure()

    $g.FillPath($bgBrush, $sqPath)

    # 2. Outer Rose-Gold Metallic Rim
    $rimPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(235, 230, 168, 160)), ([float]([Math]::Max(1.0, 7.0 * $scale)))
    $g.DrawPath($rimPen, $sqPath)

    # 3. Delicate Inset Decorative Dashed Border
    if ($size -ge 32) {
        $dashRadius = [float](104.0 * $scale)
        $dashD = $dashRadius * 2.0
        $dashPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        $dashRect = New-Object System.Drawing.RectangleF ([float](30.0 * $scale)), ([float](30.0 * $scale)), ([float](452.0 * $scale)), ([float](452.0 * $scale))
        $dashPath.AddArc($dashRect.X, $dashRect.Y, $dashD, $dashD, 180, 90)
        $dashPath.AddArc($dashRect.Right - $dashD, $dashRect.Y, $dashD, $dashD, 270, 90)
        $dashPath.AddArc($dashRect.Right - $dashD, $dashRect.Bottom - $dashD, $dashD, $dashD, 0, 90)
        $dashPath.AddArc($dashRect.X, $dashRect.Bottom - $dashD, $dashD, $dashD, 90, 90)
        $dashPath.CloseFigure()

        $dashPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(70, 240, 190, 185)), ([float]([Math]::Max(1.0, 1.5 * $scale)))
        $dashPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $g.DrawPath($dashPen, $dashPath)
        $dashPath.Dispose()
        $dashPen.Dispose()
    }

    # 4. Radiant Center Rose Aura
    $glowR = [float](180.0 * $scale)
    $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $glowPath.AddEllipse(([float]($size * 0.5 - $glowR)), ([float]($size * 0.5 - $glowR)), ([float]($glowR * 2.0)), ([float]($glowR * 2.0)))
    $glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush $glowPath
    $glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(85, 215, 125, 120)
    $glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 52, 12, 22))
    $g.FillEllipse($glowBrush, ([float]($size * 0.5 - $glowR)), ([float]($size * 0.5 - $glowR)), ([float]($glowR * 2.0)), ([float]($glowR * 2.0)))
    $glowPath.Dispose()
    $glowBrush.Dispose()

    # 5. Brushes for 3D Haute Couture Bevels
    $brushChampagne = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
        (New-Object System.Drawing.PointF 0, 0),
        (New-Object System.Drawing.PointF $size, $size),
        [System.Drawing.Color]::FromArgb(255, 255, 255, 255),
        [System.Drawing.Color]::FromArgb(255, 248, 218, 212)
    )
    $brushRoseLight = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
        (New-Object System.Drawing.PointF 0, 0),
        (New-Object System.Drawing.PointF $size, $size),
        [System.Drawing.Color]::FromArgb(255, 245, 185, 178),
        [System.Drawing.Color]::FromArgb(255, 212, 128, 123)
    )
    $brushRoseShadow = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
        (New-Object System.Drawing.PointF 0, 0),
        (New-Object System.Drawing.PointF $size, $size),
        [System.Drawing.Color]::FromArgb(255, 175, 78, 90),
        [System.Drawing.Color]::FromArgb(255, 110, 30, 42)
    )

    # Coordinates scaled
    function S([float]$v) { return [float]($v * $scale) }

    # LEFT STEM - Smooth Bracketed Curves
    # Left Half of Left Stem (Champagne Highlight)
    $pathL1 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pathL1.AddLine((S 138), (S 124), (S 180), (S 124))
    $pathL1.AddLine((S 180), (S 124), (S 180), (S 388))
    $pathL1.AddLine((S 180), (S 388), (S 138), (S 388))
    $pathL1.AddBezier((S 138), (S 388), (S 156), (S 384), (S 162), (S 372), (S 162), (S 356))
    $pathL1.AddLine((S 162), (S 356), (S 162), (S 156))
    $pathL1.AddBezier((S 162), (S 156), (S 162), (S 140), (S 156), (S 128), (S 138), (S 124))
    $pathL1.CloseFigure()
    $g.FillPath($brushChampagne, $pathL1)

    # Right Half of Left Stem (Rose Gold Shimmer)
    $pathL2 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pathL2.AddLine((S 180), (S 124), (S 222), (S 124))
    $pathL2.AddBezier((S 222), (S 124), (S 204), (S 128), (S 198), (S 140), (S 198), (S 156))
    $pathL2.AddLine((S 198), (S 156), (S 198), (S 356))
    $pathL2.AddBezier((S 198), (S 356), (S 198), (S 372), (S 204), (S 384), (S 222), (S 388))
    $pathL2.AddLine((S 222), (S 388), (S 180), (S 388))
    $pathL2.CloseFigure()
    $g.FillPath($brushRoseLight, $pathL2)

    # RIGHT STEM - Smooth Bracketed Curves
    # Left Half of Right Stem (Rose Gold Shimmer)
    $pathR1 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pathR1.AddLine((S 290), (S 124), (S 332), (S 124))
    $pathR1.AddLine((S 332), (S 124), (S 332), (S 388))
    $pathR1.AddLine((S 332), (S 388), (S 290), (S 388))
    $pathR1.AddBezier((S 290), (S 388), (S 308), (S 384), (S 314), (S 372), (S 314), (S 356))
    $pathR1.AddLine((S 314), (S 356), (S 314), (S 156))
    $pathR1.AddBezier((S 314), (S 156), (S 314), (S 140), (S 308), (S 128), (S 290), (S 124))
    $pathR1.CloseFigure()
    $g.FillPath($brushRoseLight, $pathR1)

    # Right Half of Right Stem (Champagne Light Highlight)
    $pathR2 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pathR2.AddLine((S 332), (S 124), (S 374), (S 124))
    $pathR2.AddBezier((S 374), (S 124), (S 356), (S 128), (S 350), (S 140), (S 350), (S 156))
    $pathR2.AddLine((S 350), (S 156), (S 350), (S 356))
    $pathR2.AddBezier((S 350), (S 356), (S 350), (S 372), (S 356), (S 384), (S 374), (S 388))
    $pathR2.AddLine((S 374), (S 388), (S 332), (S 388))
    $pathR2.CloseFigure()
    $g.FillPath($brushChampagne, $pathR2)

    # ELEGANT CROSSBAR
    # Top Bevel (Champagne)
    $pathBarTop = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pathBarTop.AddLine((S 198), (S 244), (S 314), (S 244))
    $pathBarTop.AddLine((S 314), (S 244), (S 314), (S 256))
    $pathBarTop.AddLine((S 314), (S 256), (S 198), (S 256))
    $pathBarTop.CloseFigure()
    $g.FillPath($brushChampagne, $pathBarTop)

    # Bottom Bevel (Rose Shadow)
    $pathBarBot = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pathBarBot.AddLine((S 198), (S 256), (S 314), (S 256))
    $pathBarBot.AddLine((S 314), (S 256), (S 314), (S 268))
    $pathBarBot.AddLine((S 314), (S 268), (S 198), (S 268))
    $pathBarBot.CloseFigure()
    $g.FillPath($brushRoseShadow, $pathBarBot)

    # Center Sparkling Diamond Nexus
    $diamondPts = @(
        (New-Object System.Drawing.PointF (S 256), (S 238)),
        (New-Object System.Drawing.PointF (S 272), (S 256)),
        (New-Object System.Drawing.PointF (S 256), (S 274)),
        (New-Object System.Drawing.PointF (S 240), (S 256))
    )
    $solidWhite = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillPolygon($solidWhite, $diamondPts)

    # SIGNATURE SPARK STAR (Comfortably positioned inside at X=384, Y=144)
    $sx = (S 384)
    $sy = (S 144)
    $sLong = (S 44)
    $sWide = (S 8.5)

    # Star Rays
    # Top Ray
    $g.FillPolygon($brushRoseLight, @(
        (New-Object System.Drawing.PointF $sx, ($sy - $sLong)),
        (New-Object System.Drawing.PointF ($sx - $sWide), $sy),
        (New-Object System.Drawing.PointF $sx, $sy)
    ))
    $g.FillPolygon($solidWhite, @(
        (New-Object System.Drawing.PointF $sx, ($sy - $sLong)),
        (New-Object System.Drawing.PointF ($sx + $sWide), $sy),
        (New-Object System.Drawing.PointF $sx, $sy)
    ))

    # Bottom Ray
    $g.FillPolygon($solidWhite, @(
        (New-Object System.Drawing.PointF $sx, ($sy + $sLong)),
        (New-Object System.Drawing.PointF ($sx - $sWide), $sy),
        (New-Object System.Drawing.PointF $sx, $sy)
    ))
    $g.FillPolygon($brushRoseShadow, @(
        (New-Object System.Drawing.PointF $sx, ($sy + $sLong)),
        (New-Object System.Drawing.PointF ($sx + $sWide), $sy),
        (New-Object System.Drawing.PointF $sx, $sy)
    ))

    # Left Ray
    $g.FillPolygon($solidWhite, @(
        (New-Object System.Drawing.PointF ($sx - $sLong), $sy),
        (New-Object System.Drawing.PointF $sx, ($sy - $sWide)),
        (New-Object System.Drawing.PointF $sx, $sy)
    ))
    $g.FillPolygon($brushRoseShadow, @(
        (New-Object System.Drawing.PointF ($sx - $sLong), $sy),
        (New-Object System.Drawing.PointF $sx, ($sy + $sWide)),
        (New-Object System.Drawing.PointF $sx, $sy)
    ))

    # Right Ray
    $g.FillPolygon($solidWhite, @(
        (New-Object System.Drawing.PointF ($sx + $sLong), $sy),
        (New-Object System.Drawing.PointF $sx, ($sy - $sWide)),
        (New-Object System.Drawing.PointF $sx, $sy)
    ))
    $g.FillPolygon($brushRoseLight, @(
        (New-Object System.Drawing.PointF ($sx + $sLong), $sy),
        (New-Object System.Drawing.PointF $sx, ($sy + $sWide)),
        (New-Object System.Drawing.PointF $sx, $sy)
    ))

    # Center Star Glint
    $glintR = [float]($sWide * 0.9)
    $g.FillEllipse($solidWhite, ($sx - $glintR), ($sy - $glintR), ($glintR * 2.0), ($glintR * 2.0))

    # Micro Sparkle (Bottom Left at X=128, Y=368)
    if ($size -ge 32) {
        $mx = (S 128)
        $my = (S 368)
        $mR = (S 16)
        $mW = (S 3.5)
        $microPts = @(
            (New-Object System.Drawing.PointF $mx, ($my - $mR)),
            (New-Object System.Drawing.PointF ($mx + $mW), $my),
            (New-Object System.Drawing.PointF $mx, ($my + $mR)),
            (New-Object System.Drawing.PointF ($mx - $mW), $my)
        )
        $g.FillPolygon($solidWhite, $microPts)
        $microPts2 = @(
            (New-Object System.Drawing.PointF ($mx - $mR), $my),
            (New-Object System.Drawing.PointF $mx, ($my - $mW)),
            (New-Object System.Drawing.PointF ($mx + $mR), $my),
            (New-Object System.Drawing.PointF $mx, ($my + $mW))
        )
        $g.FillPolygon($solidWhite, $microPts2)
    }

    # Save
    if ($isIco) {
        $iconHandle = $bmp.GetHicon()
        $icon = [System.Drawing.Icon]::FromHandle($iconHandle)
        $fileStream = New-Object System.IO.FileStream $outputPath, ([System.IO.FileMode]::Create)
        $icon.Save($fileStream)
        $fileStream.Close()
        $icon.Dispose()
    } else {
        $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }

    # Cleanup
    $g.Dispose()
    $bmp.Dispose()
    $bgBrush.Dispose()
    $rimPen.Dispose()
    $sqPath.Dispose()
    $brushChampagne.Dispose()
    $brushRoseLight.Dispose()
    $brushRoseShadow.Dispose()
    $solidWhite.Dispose()
    $pathL1.Dispose()
    $pathL2.Dispose()
    $pathR1.Dispose()
    $pathR2.Dispose()
    $pathBarTop.Dispose()
    $pathBarBot.Dispose()
}

Draw-Favicon 32 "m:\SUBJECTS\Harsh port\favicon.ico" $true
Draw-Favicon 32 "m:\SUBJECTS\Harsh port\favicon-32x32.png" $false
Draw-Favicon 16 "m:\SUBJECTS\Harsh port\favicon-16x16.png" $false
Draw-Favicon 180 "m:\SUBJECTS\Harsh port\apple-touch-icon.png" $false
Draw-Favicon 512 "m:\SUBJECTS\Harsh port\logo-preview-512.png" $false
Write-Output "Favicons successfully generated!"
